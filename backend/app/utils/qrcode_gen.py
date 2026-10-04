import os
import qrcode
from qrcode.constants import ERROR_CORRECT_M

def generate_batch_qr(batch_code: str, base_url: str = "http://127.0.0.1:8000") -> str:
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    qr_dir = os.path.join(project_root, "static", "qr")
    os.makedirs(qr_dir, exist_ok=True)

    tracking_url = f"{base_url}/track/{batch_code}"
    filename = f"{batch_code}.png"
    filepath = os.path.join(qr_dir, filename)

    qr = qrcode.QRCode(
        version=1,
        error_correction=ERROR_CORRECT_M,
        box_size=10,
        border=2,
    )
    qr.add_data(tracking_url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(filepath)

    return f"/static/qr/{filename}"