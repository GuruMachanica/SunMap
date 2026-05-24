#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Simple HTTP server for SunMap frontend
"""

import http.server
import socketserver
import os
import webbrowser
from threading import Timer

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def open_browser():
    """Open browser after a short delay"""
    webbrowser.open('http://localhost:8000')

def main():
    # Try to bind to a free port starting at 8000
    START_PORT = 8000
    MAX_PORT = 8010

    # Change to the directory containing the HTML files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))

    httpd = None
    chosen_port = None
    for PORT in range(START_PORT, MAX_PORT + 1):
        try:
            httpd = socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler)
            chosen_port = PORT
            break
        except OSError as e:
            # Port in use, try next
            print(f"Port {PORT} unavailable: {e}")
            continue

    if httpd is None:
        print(f"Unable to bind to any port in range {START_PORT}-{MAX_PORT}. Exiting.")
        return

    try:
        print(f"🌞 SunMap Frontend Server")
        print(f"Server running at http://localhost:{chosen_port}")
        print(f"Serving files from: {os.getcwd()}")
        print("\nPress Ctrl+C to stop the server")

        # Open browser after 1 second (point to chosen port)
        Timer(1.0, lambda: webbrowser.open(f'http://localhost:{chosen_port}')).start()

        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    finally:
        try:
            httpd.server_close()
        except Exception:
            pass

if __name__ == '__main__':
    main()
