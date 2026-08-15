import os
import shutil

src_backend = r"c:\Users\ASUS\Desktop\xampp\htdocs\samai\backend"
src_frontend = r"c:\Users\ASUS\Desktop\xampp\htdocs\samai\frontend\out"
target = r"c:\Users\ASUS\Desktop\xampp\htdocs\samai\cpanel_deploy_package"

if os.path.exists(target):
    shutil.rmtree(target)

os.makedirs(target, exist_ok=True)

# Copy backend items (including .htaccess)
for item in os.listdir(src_backend):
    if item in ('venv', '__pycache__', 'samai.db', 'make_package.py', '.git'):
        continue
    s_path = os.path.join(src_backend, item)
    t_path = os.path.join(target, item)
    if os.path.isdir(s_path):
        shutil.copytree(s_path, t_path, ignore=shutil.ignore_patterns('__pycache__', 'venv', '*.db'))
    else:
        shutil.copy2(s_path, t_path)

# Ensure .htaccess is copied if present
htaccess_src = os.path.join(src_backend, ".htaccess")
if os.path.exists(htaccess_src):
    shutil.copy2(htaccess_src, os.path.join(target, ".htaccess"))

# Copy pre-compiled frontend static files into target/frontend_out
frontend_target = os.path.join(target, "frontend_out")
shutil.copytree(src_frontend, frontend_target)

# Zip target folder
zip_path = r"c:\Users\ASUS\Desktop\xampp\htdocs\samai\samai_cpanel_ready.zip"
shutil.make_archive(zip_path.replace(".zip", ""), 'zip', target)

print("Package successfully created at:", target)
print("ZIP archive created at:", zip_path)
