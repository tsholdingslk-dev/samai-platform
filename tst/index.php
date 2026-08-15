<?php
/**
 * SAM AI Translation Web App (tst)
 * Supports Localhost (http://127.0.0.1:8000) & Live Server (http://samai.uhrpo.com)
 */
session_start();

$translated_text = "";
$error_message = "";
$source_text = isset($_POST['text']) ? trim($_POST['text']) : "";
$source_lang = isset($_POST['source_lang']) ? $_POST['source_lang'] : "auto";
$target_lang = isset($_POST['target_lang']) ? $_POST['target_lang'] : "ta";
$server_choice = isset($_POST['server_choice']) ? $_POST['server_choice'] : "local";

// Base API URLs
$base_domain = ($server_choice === "live") ? 'http://samai.uhrpo.com' : 'http://127.0.0.1:8000';

$auth_url = $base_domain . '/auth/login';
$api_url = $base_domain . '/pdf-translate/translate';

// Helper function to auto-authenticate and fetch Bearer JWT token
function get_sam_access_token($login_endpoint) {
    $session_key = 'sam_token_' . md5($login_endpoint);
    if (isset($_SESSION[$session_key]) && !empty($_SESSION[$session_key])) {
        return $_SESSION[$session_key];
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $login_endpoint);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'email' => 'sam@mail.com',
        'password' => '123456'
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($response, true);
    if (isset($data['access_token'])) {
        $_SESSION[$session_key] = $data['access_token'];
        return $data['access_token'];
    }
    return null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($source_text)) {
    $token = get_sam_access_token($auth_url);

    $post_data = [
        'text' => $source_text,
        'source_lang' => $source_lang,
        'target_lang' => $target_lang
    ];

    $headers = [
        'Content-Type: application/x-www-form-urlencoded'
    ];
    if ($token) {
        $headers[] = 'Authorization: Bearer ' . $token;
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $api_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    $curl_error = curl_error($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($curl_error) {
        $error_message = "cURL Error: " . $curl_error;
    } else if ($http_code === 200) {
        $data = json_decode($response, true);
        if (isset($data['translated_text'])) {
            $translated_text = $data['translated_text'];
        } else {
            $error_message = "Translation API response invalid: " . $response;
        }
    } else {
        $error_message = "API Error (Status {$http_code}): " . $response;
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SAM AI - PHP Translator Test (tst)</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #0b0f19;
            --panel-bg: rgba(22, 27, 46, 0.75);
            --primary: #8b5cf6;
            --primary-hover: #7c3aed;
            --text-main: #f3f4f6;
            --text-muted: #9ca3af;
            --border-color: rgba(139, 92, 246, 0.2);
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: 'Outfit', sans-serif;
        }

        body {
            background-color: var(--bg-dark);
            background-image: 
                radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.15) 0px, transparent 50%),
                radial-gradient(at 100% 100%, rgba(59, 130, 246, 0.15) 0px, transparent 50%);
            color: var(--text-main);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 1.5rem;
        }

        .container {
            width: 100%;
            max-width: 750px;
            background: var(--panel-bg);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }

        .header {
            text-align: center;
            margin-bottom: 1.5rem;
        }

        .header h1 {
            font-size: 2.2rem;
            background: linear-gradient(135deg, #a78bfa, #60a5fa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }

        .header p {
            color: var(--text-muted);
            font-size: 0.95rem;
        }

        .server-toggle {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid var(--border-color);
            padding: 0.75rem;
            border-radius: 12px;
            margin-bottom: 1.5rem;
        }

        .server-toggle label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 600;
        }

        .server-toggle input[type="radio"] {
            accent-color: var(--primary);
            cursor: pointer;
        }

        .lang-selector {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            gap: 1rem;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        select {
            width: 100%;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 0.75rem 1rem;
            border-radius: 10px;
            font-size: 1rem;
            outline: none;
            cursor: pointer;
        }

        .arrow {
            color: var(--primary);
            font-size: 1.5rem;
            text-align: center;
        }

        textarea {
            width: 100%;
            height: 120px;
            background: rgba(15, 23, 42, 0.8);
            border: 1px solid var(--border-color);
            color: var(--text-main);
            padding: 1rem;
            border-radius: 12px;
            font-size: 1rem;
            outline: none;
            resize: vertical;
            margin-bottom: 1.5rem;
        }

        .btn-submit {
            width: 100%;
            background: linear-gradient(135deg, var(--primary), var(--primary-hover));
            color: white;
            border: none;
            padding: 0.9rem;
            border-radius: 10px;
            font-size: 1.05rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
        }

        .output-box {
            margin-top: 2rem;
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid rgba(59, 130, 246, 0.3);
            border-radius: 12px;
            padding: 1.2rem;
        }

        .output-title {
            font-size: 0.85rem;
            color: #93c5fd;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
            font-weight: 600;
        }

        .output-content {
            font-size: 1.1rem;
            line-height: 1.6;
            color: #f3f4f6;
            white-space: pre-wrap;
        }

        .error-box {
            margin-top: 1.5rem;
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fca5a5;
            padding: 1rem;
            border-radius: 10px;
            font-size: 0.95rem;
        }

        .api-info {
            margin-top: 2rem;
            font-size: 0.8rem;
            color: var(--text-muted);
            text-align: center;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
            padding-top: 1rem;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <h1>SAM AI Translator (TST)</h1>
        <p>Test Translation Engine against Local & Live Servers</p>
    </div>

    <form method="POST" action="">
        <div class="server-toggle">
            <label>
                <input type="radio" name="server_choice" value="local" <?php echo $server_choice === 'local' ? 'checked' : ''; ?>>
                💻 Localhost Server (127.0.0.1:8000)
            </label>
            <label>
                <input type="radio" name="server_choice" value="live" <?php echo $server_choice === 'live' ? 'checked' : ''; ?>>
                🌐 Live cPanel Server (samai.uhrpo.com)
            </label>
        </div>

        <div class="lang-selector">
            <select name="source_lang">
                <option value="auto" <?php echo $source_lang == 'auto' ? 'selected' : ''; ?>>🌐 Auto-Detect Language</option>
                <option value="en" <?php echo $source_lang == 'en' ? 'selected' : ''; ?>>English</option>
                <option value="ta" <?php echo $source_lang == 'ta' ? 'selected' : ''; ?>>Tamil (தமிழ்)</option>
                <option value="si" <?php echo $source_lang == 'si' ? 'selected' : ''; ?>>Sinhala (சிங்களம்)</option>
            </select>

            <span class="arrow">➔</span>

            <select name="target_lang">
                <option value="ta" <?php echo $target_lang == 'ta' ? 'selected' : ''; ?>>Tamil (தமிழ்)</option>
                <option value="en" <?php echo $target_lang == 'en' ? 'selected' : ''; ?>>English</option>
                <option value="si" <?php echo $target_lang == 'si' ? 'selected' : ''; ?>>Sinhala (சிங்களம்)</option>
            </select>
        </div>

        <textarea name="text" placeholder="Enter text here to translate..." required><?php echo htmlspecialchars($source_text); ?></textarea>

        <button type="submit" class="btn-submit">🚀 Translate Now via Selected Server</button>
    </form>

    <?php if (!empty($translated_text)): ?>
        <div class="output-box">
            <div class="output-title">Translated Result:</div>
            <div class="output-content"><?php echo htmlspecialchars($translated_text); ?></div>
        </div>
    <?php endif; ?>

    <?php if (!empty($error_message)): ?>
        <div class="error-box">
            ⚠️ <?php echo htmlspecialchars($error_message); ?>
        </div>
    <?php endif; ?>

    <div class="api-info">
        Target API Endpoint: <code><?php echo htmlspecialchars($api_url); ?></code>
    </div>
</div>

</body>
</html>
