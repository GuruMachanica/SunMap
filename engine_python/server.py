#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Simple HTTP server for SunMap frontend
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from threading import Timer

# Ensure UTF-8 output
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # Clean request logging
        sys.stdout.write("[SunMap] %s - - [%s] %s\n" %
                         (self.address_string(),
                          self.log_date_time_string(),
                          format%args))
        sys.stdout.flush()

def open_browser(port=8000):
    """Open browser after a short delay"""
    try:
        webbrowser.open(f'http://localhost:{port}')
    except Exception:
        pass

def main():
    requested_port = 8000
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        requested_port = int(sys.argv[1])
    
    # Change to directory containing HTML files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    ServerClass = getattr(http.server, 'ThreadingHTTPServer', socketserver.TCPServer)
    ServerClass.allow_reuse_address = True
    
    # Try requested port or fallback
    ports_to_try = [requested_port, 8080, 8001, 8002, 5000]
    httpd = None
    actual_port = requested_port
    
    for p in ports_to_try:
        try:
            httpd = ServerClass(("0.0.0.0", p), CustomHTTPRequestHandler)
            actual_port = p
            break
        except OSError:
            continue

    if httpd is None:
        try:
            httpd = ServerClass(("0.0.0.0", 0), CustomHTTPRequestHandler)
            actual_port = httpd.server_address[1]
        except Exception as e:
            print(f"Error starting server: {e}", flush=True)
            sys.exit(1)
            
    with httpd:
        print("=" * 60, flush=True)
        print(f"  SunMap 3D Visualizer Server Running", flush=True)
        print(f"  Open in Browser: http://localhost:{actual_port}", flush=True)
        print(f"  Local IP:        http://127.0.0.1:{actual_port}", flush=True)
        print(f"  Serving from:    {os.getcwd()}", flush=True)
        print("=" * 60, flush=True)
        print("Keep this terminal open while using SunMap.", flush=True)
        print("Press Ctrl+C to stop the server.\n", flush=True)
        
        if "--no-browser" not in sys.argv:
            Timer(1.0, open_browser, args=[actual_port]).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[SunMap] Server stopped.", flush=True)

if __name__ == '__main__':
    main()


