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
    PORT = 8000
    
    # Change to the directory containing the HTML files
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"🌞 SunMap Frontend Server")
        print(f"Server running at http://localhost:{PORT}")
        print(f"Serving files from: {os.getcwd()}")
        print("\nPress Ctrl+C to stop the server")
        
        # Open browser after 1 second
        Timer(1.0, open_browser).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == '__main__':
    main()
