"""Local preview server that behaves like GitHub Pages: /research serves research.html,
unknown paths get 404.html.  usage: python tools/serve.py [port]"""
import http.server, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k): super().__init__(*a, directory=ROOT, **k)
    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        fs = self.translate_path(path)
        if not os.path.exists(fs) and os.path.exists(fs + ".html"):
            self.path = path + ".html" + (self.path[len(path):])
        elif not os.path.exists(fs):
            self.send_response(404); self.send_header("Content-Type", "text/html; charset=utf-8"); self.end_headers()
            return open(os.path.join(ROOT, "404.html"), "rb")
        return super().send_head()

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    http.server.ThreadingHTTPServer(("127.0.0.1", port), H).serve_forever()
