"""
Monitoring service for attention tracking
"""
import time
import math
from datetime import datetime
from collections import deque
from typing import Tuple, List
import cv2
import numpy as np
from backend.config import (
    LOOK_AWAY_SECONDS_THRESHOLD, NO_FACE_SECONDS_THRESHOLD, PARTIAL_FACE_SECONDS_THRESHOLD,
    MIN_FACE_BOX_WIDTH, EDGE_MARGIN, GAZE_LEFT_THRESH, GAZE_RIGHT_THRESH,
    EYE_DOWN_THRESH, EYE_UP_THRESH, HEAD_PITCH_DOWN_DEG,
    HAND_WRITING_Y_THRESHOLD, HAND_MOTION_WINDOW, HAND_MOTION_MIN_SPEED,
    LEFT_EYE_CORNERS, RIGHT_EYE_CORNERS, LEFT_IRIS, RIGHT_IRIS,
    LEFT_EYE_TOP, LEFT_EYE_BOTTOM, RIGHT_EYE_TOP, RIGHT_EYE_BOTTOM,
    HP_N, HP_CHIN, HP_LEFT_EYE, HP_RIGHT_EYE, HP_LEFT_MOUTH, HP_RIGHT_MOUTH,
    MODEL_POINTS
)
from backend.services.detection_service import (
    detect_phone_with_yolo, phone_in_detections, person_in_detections,
    get_face_mesh, get_hands_module, get_mp_draw, is_yolo_available
)
import mediapipe as mp
mp_hands = mp.solutions.hands
from backend.utils.logger import log_event

# Convert MODEL_POINTS to numpy array
MODEL_POINTS_NP = np.array(MODEL_POINTS, dtype=np.float64)

class MonitoringSession:
    """Session for monitoring attention"""
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.active = False
        self.alerts = deque(maxlen=200)
        self.last_face_seen = time.time()
        self.last_full_face = time.time()
        self.last_looking_center = time.time()
        self.current_alert = None
        self.hand_history = []
        self.hand_writing_state = False
        self.room_scan_completed = False
        self.room_scan_passed = False
        
    def log_alert(self, alert_type: str, detail: str):
        """Log an alert"""
        timestamp = datetime.utcnow().isoformat()
        self.alerts.append({
            'timestamp': timestamp,
            'type': alert_type,
            'detail': detail
        })
        log_event(alert_type, detail)

# Global session store
monitoring_sessions = {}

def get_or_create_session(session_id: str) -> MonitoringSession:
    """Get or create a monitoring session"""
    if session_id not in monitoring_sessions:
        monitoring_sessions[session_id] = MonitoringSession(session_id)
    return monitoring_sessions[session_id]

def process_frame_complete(frame: np.ndarray, session: MonitoringSession) -> Tuple[np.ndarray, List[str], str, List[str]]:
    """Complete frame processing with all monitoring features"""
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    
    face_mesh = get_face_mesh()
    hands_module = get_hands_module()
    mp_draw = get_mp_draw()
    
    results = face_mesh.process(rgb)
    hands_results = hands_module.process(rgb)
    now = time.time()
    
    alerts = []
    status = "OK"
    alert_details = []
    
    # Phone detection
    phone_detected = False
    phone_info = None
    person_detected = False
    person_count = 0
    
    if is_yolo_available():
        try:
            dets = detect_phone_with_yolo(frame)
            phone_detected, phone_info = phone_in_detections(dets)
            person_detected, persons = person_in_detections(dets)
            person_count = len(persons)
            
            for label, conf, box in dets:
                x1, y1, x2, y2 = box
                color = (0, 0, 255) if "phone" in label.lower() else (0, 120, 255)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1-6),
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)
        except Exception as e:
            print("YOLO error:", e)
    
    if phone_detected:
        alerts.append("PHONE_DETECTED")
        alert_details.append(f"Phone: {phone_info[0]} ({phone_info[1]:.2f})")
        if session.current_alert != "phone":
            session.log_alert("ALERT_PHONE_DETECTED", f"{phone_info}")
            session.current_alert = "phone"
    
    if person_count > 1:
        alerts.append("MULTIPLE_PERSONS")
        alert_details.append(f"Multiple persons: {person_count}")
        if session.current_alert != "multiple_persons":
            session.log_alert("ALERT_MULTIPLE_PERSONS", f"count={person_count}")
            session.current_alert = "multiple_persons"
    
    # Hand detection
    hand_centers = []
    if hands_results.multi_hand_landmarks:
        for handlms in hands_results.multi_hand_landmarks:
            xs = [lm.x for lm in handlms.landmark]
            ys = [lm.y for lm in handlms.landmark]
            cx = float(np.mean(xs))
            cy = float(np.mean(ys))
            hand_centers.append((cx, cy))
            mp_draw.draw_landmarks(frame, handlms, mp_hands.HAND_CONNECTIONS)
    
    for (cx, cy) in hand_centers:
        session.hand_history.append((now, cx, cy))
    session.hand_history = [h_i for h_i in session.hand_history if now - h_i[0] <= HAND_MOTION_WINDOW]
    
    session.hand_writing_state = False
    if len(session.hand_history) >= 2:
        xs = [x for (_, x, _) in session.hand_history]
        ys = [y for (_, _, y) in session.hand_history]
        dt = session.hand_history[-1][0] - session.hand_history[0][0]
        dx = xs[-1] - xs[0]
        dy = ys[-1] - ys[0]
        speed = math.hypot(dx, dy) / max(1e-6, dt)
        last_y = session.hand_history[-1][2]
        if speed >= HAND_MOTION_MIN_SPEED and last_y >= HAND_WRITING_Y_THRESHOLD:
            session.hand_writing_state = True
            cv2.putText(frame, "WRITING DETECTED", (10, 90),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)
    
    # Face detection
    if not results.multi_face_landmarks:
        if now - session.last_face_seen > NO_FACE_SECONDS_THRESHOLD:
            alerts.append("NO_FACE")
            alert_details.append(f"No face for {now - session.last_face_seen:.1f}s")
            status = "No face detected"
            if session.current_alert != "no_face":
                session.log_alert("ALERT_NO_FACE", f"duration={now - session.last_face_seen:.1f}s")
                session.current_alert = "no_face"
        else:
            status = "No face (waiting)"
    else:
        session.last_face_seen = now
        if session.current_alert == "no_face":
            session.current_alert = None
        
        lm = results.multi_face_landmarks[0].landmark
        xs = np.array([l.x for l in lm])
        ys = np.array([l.y for l in lm])
        min_x, max_x = xs.min(), xs.max()
        min_y, max_y = ys.min(), ys.max()
        box_w = max_x - min_x
        
        touching_edge = (min_x < EDGE_MARGIN) or (max_x > 1.0 - EDGE_MARGIN) or \
                       (min_y < EDGE_MARGIN) or (max_y > 1.0 - EDGE_MARGIN)
        
        if box_w < MIN_FACE_BOX_WIDTH or touching_edge:
            if now - session.last_full_face > PARTIAL_FACE_SECONDS_THRESHOLD:
                alerts.append("PARTIAL_FACE")
                alert_details.append("Face partially visible")
                status = "Partial face"
                if session.current_alert != "partial_face":
                    session.log_alert("ALERT_PARTIAL_FACE", f"bbox_w={box_w:.3f}, edge={touching_edge}")
                    session.current_alert = "partial_face"
        else:
            session.last_full_face = now
            if session.current_alert == "partial_face":
                session.current_alert = None
            
            # Gaze tracking
            left_iris_x = np.mean([lm[i].x for i in LEFT_IRIS])
            left_iris_y = np.mean([lm[i].y for i in LEFT_IRIS])
            right_iris_x = np.mean([lm[i].x for i in RIGHT_IRIS])
            right_iris_y = np.mean([lm[i].y for i in RIGHT_IRIS])
            
            left_eye_left_x = lm[LEFT_EYE_CORNERS[0]].x
            left_eye_right_x = lm[LEFT_EYE_CORNERS[1]].x
            right_eye_left_x = lm[RIGHT_EYE_CORNERS[0]].x
            right_eye_right_x = lm[RIGHT_EYE_CORNERS[1]].x
            
            left_eye_width = max(left_eye_right_x - left_eye_left_x, 1e-6)
            right_eye_width = max(right_eye_right_x - right_eye_left_x, 1e-6)
            
            left_h_ratio = (left_iris_x - left_eye_left_x) / left_eye_width
            right_h_ratio = (right_iris_x - right_eye_left_x) / right_eye_width
            gaze_h_ratio = (left_h_ratio + right_h_ratio) / 2.0
            
            left_top_y = lm[LEFT_EYE_TOP].y
            left_bottom_y = lm[LEFT_EYE_BOTTOM].y
            right_top_y = lm[RIGHT_EYE_TOP].y
            right_bottom_y = lm[RIGHT_EYE_BOTTOM].y
            
            left_eye_height = max(left_bottom_y - left_top_y, 1e-6)
            right_eye_height = max(right_bottom_y - right_top_y, 1e-6)
            
            left_v_ratio = (left_iris_y - left_top_y) / left_eye_height
            right_v_ratio = (right_iris_y - right_top_y) / right_eye_height
            gaze_v_ratio = (left_v_ratio + right_v_ratio) / 2.0
            
            cv2.circle(frame, (int(left_iris_x*w), int(left_iris_y*h)), 3, (0, 255, 255), -1)
            cv2.circle(frame, (int(right_iris_x*w), int(right_iris_y*h)), 3, (0, 255, 255), -1)
            cv2.rectangle(frame, (int(min_x*w), int(min_y*h)),
                         (int(max_x*w), int(max_y*h)), (200, 200, 200), 1)
            
            gaze_state_h = "center"
            if gaze_h_ratio < GAZE_LEFT_THRESH:
                gaze_state_h = "right"
            elif gaze_h_ratio > GAZE_RIGHT_THRESH:
                gaze_state_h = "left"
            
            gaze_state_v = "center_v"
            if gaze_v_ratio > EYE_DOWN_THRESH:
                gaze_state_v = "down"
            elif gaze_v_ratio < EYE_UP_THRESH:
                gaze_state_v = "up"
            
            # Head pose
            image_points = np.array([
                (lm[HP_N].x * w, lm[HP_N].y * h),
                (lm[HP_CHIN].x * w, lm[HP_CHIN].y * h),
                (lm[HP_LEFT_EYE].x * w, lm[HP_LEFT_EYE].y * h),
                (lm[HP_RIGHT_EYE].x * w, lm[HP_RIGHT_EYE].y * h),
                (lm[HP_LEFT_MOUTH].x * w, lm[HP_LEFT_MOUTH].y * h),
                (lm[HP_RIGHT_MOUTH].x * w, lm[HP_RIGHT_MOUTH].y * h)
            ], dtype=np.float64)
            
            focal_length = w
            center = (w/2, h/2)
            camera_matrix = np.array([
                [focal_length, 0, center[0]],
                [0, focal_length, center[1]],
                [0, 0, 1]
            ], dtype="double")
            dist_coeffs = np.zeros((4, 1))
            
            pitch = 0.0
            try:
                success_pnp, rotation_vector, translation_vector = cv2.solvePnP(
                    MODEL_POINTS_NP, image_points, camera_matrix, dist_coeffs,
                    flags=cv2.SOLVEPNP_ITERATIVE)
                if success_pnp:
                    rmat, _ = cv2.Rodrigues(rotation_vector)
                    proj_matrix = np.hstack((rmat, translation_vector))
                    eulerAngles = cv2.decomposeProjectionMatrix(proj_matrix)[6]
                    pitch = float(eulerAngles[0])
            except:
                pitch = 0.0
            
            attention_ok = True
            
            if gaze_state_h != "center":
                if now - session.last_looking_center > LOOK_AWAY_SECONDS_THRESHOLD:
                    alerts.append("LOOKING_AWAY")
                    alert_details.append(f"Looking {gaze_state_h}")
                    attention_ok = False
                    if session.current_alert != "look_away":
                        session.log_alert("ALERT_LOOK_AWAY", gaze_state_h)
                        session.current_alert = "look_away"
            else:
                session.last_looking_center = now
                if session.current_alert == "look_away":
                    session.current_alert = None
            
            if gaze_state_v == "down" or pitch > HEAD_PITCH_DOWN_DEG:
                if not session.hand_writing_state:
                    attention_ok = False
                    if gaze_state_v == "down":
                        alerts.append("EYES_DOWN")
                        alert_details.append("Eyes looking down")
                    if pitch > HEAD_PITCH_DOWN_DEG:
                        alerts.append("HEAD_DOWN")
                        alert_details.append(f"Head down ({pitch:.1f}°)")
            
            if attention_ok and not phone_detected and person_count <= 1:
                status = "Attention OK"
            
            cv2.putText(frame, f"Gaze H:{gaze_h_ratio:.2f} V:{gaze_v_ratio:.2f}",
                       (10, h-40), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(frame, f"Pitch:{pitch:.1f}",
                       (10, h-70), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
    
    if alerts:
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (w, h), (0, 0, 255), -1)
        cv2.addWeighted(overlay, 0.3, frame, 0.7, 0, frame)
        cv2.putText(frame, "ALERT", (w//2 - 60, 60),
                   cv2.FONT_HERSHEY_DUPLEX, 1.5, (255, 255, 255), 3)
        y_offset = 100
        for detail in alert_details[:3]:
            cv2.putText(frame, detail, (20, y_offset),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            y_offset += 30
    else:
        cv2.putText(frame, status, (20, 40),
                   cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
    
    return frame, alerts, status, alert_details

