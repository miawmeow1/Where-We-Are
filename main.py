import time
from threading import Thread, Lock
import sys
import random
import os
import tkinter as tk
from tkinter import font as tkfont

lock = Lock()

# Flower and bubble characters
FLOWERS = ['🌸', '🌺', '🌹', '🌻', '🌷', '🌼', '💐', '🌿']
BUBBLES = ['○', '◌', '◍', '●', '◉', '〇', '○', '⋆']
SPARKLES = ['✨', '🌟', '💫', '⭐']

class LyricsPopup:
    def __init__(self):
        self.window = None
        self.setup_window()
    
    def setup_window(self):
        self.window = tk.Tk()
        self.window.title("🎵 Lyrics 🎵")
        self.window.geometry("600x200+400+300")
        self.window.overrideredirect(True)
        self.window.attributes('-topmost', True)
        
        # Make window semi-transparent
        self.window.attributes('-alpha', 0.0)
        
        # Set background color
        self.window.configure(bg='#1a1a2e')
        
        # Create label for lyrics
        self.label = tk.Label(
            self.window,
            text="",
            font=("Arial", 16, "bold"),
            fg='#e94560',
            bg='#1a1a2e',
            wraplength=550,
            justify='center'
        )
        self.label.pack(expand=True, fill='both', padx=20, pady=20)
        
        # Create bubble effect label
        self.bubble_frame = tk.Frame(self.window, bg='#1a1a2e')
        self.bubble_frame.place(relx=0.5, rely=0.5, anchor='center')
        
        self.bubble_labels = []
        for _ in range(5):
            lbl = tk.Label(
                self.bubble_frame,
                text="○",
                font=("Arial", 10),
                fg='#16213e',
                bg='#1a1a2e'
            )
            self.bubble_labels.append(lbl)
        
        self.fade_in_progress = False
    
    def fade_in(self):
        if not self.fade_in_progress:
            self.fade_in_progress = True
            alpha = 0.0
            while alpha < 0.9:
                alpha += 0.05
                self.window.attributes('-alpha', alpha)
                self.window.update()
                time.sleep(0.03)
            self.window.attributes('-alpha', 0.95)
            self.fade_in_progress = False
    
    def update_lyric(self, text):
        self.label.config(text=text)
        if not self.fade_in_progress:
            self.fade_in()
    
    def animate_bubbles(self):
        while True:
            for lbl in self.bubble_labels:
                bubble = random.choice(BUBBLES)
                lbl.config(text=bubble, fg=random.choice(['#e94560', '#0f3460', '#16213e', '#533483']))
                x = random.randint(0, 200)
                y = random.randint(0, 50)
                lbl.place(x=x, y=y)
            time.sleep(0.5)
    
    def start(self):
        self.window.after(100, self.fade_in)
        self.window.mainloop()

def display_flower_burst():
    """Display a burst of flowers in terminal"""
    with lock:
        for _ in range(3):
            flower_line = "  ".join(random.choices(FLOWERS, k=5))
            sys.stdout.write(f"\r{flower_line}")
            sys.stdout.flush()
            time.sleep(0.3)
        print()

def bubble_effect(text):
    """Add bubble animation around text"""
    with lock:
        # Create bubble border
        bubbles = []
        for _ in range(min(len(text), 20)):
            if random.random() < 0.3:
                bubbles.append(random.choice(SPARKLES))
            else:
                bubbles.append(random.choice(BUBBLES))
        
        top_border = "  ".join(bubbles[:len(text)//2 + 2])
        bottom_border = "  ".join(bubbles[::-1][:len(text)//2 + 2])
        
        print(f"\n{top_border}")
        
        # Flower decorations
        flower_left = random.choice(FLOWERS)
        flower_right = random.choice(FLOWERS)
        sys.stdout.write(f"{flower_left} ")
        for char in text:
            sys.stdout.write(char)
            sys.stdout.flush()
            time.sleep(0.05)
        sys.stdout.write(f" {flower_right}")
        print()
        
        print(f"{bottom_border}\n")

def animate_text(text, delay=0.1):
    with lock:
        for char in text:
            sys.stdout.write(char)
            sys.stdout.flush()
            time.sleep(delay)
        print()

def sing_lyric(lyric, delay, speed, popup=None):
    time.sleep(delay)
    
    # Display flowers and bubbles before lyric
    display_flower_burst()
    time.sleep(0.2)
    
    # Animate the lyric
    animate_text(lyric, speed)
    
    # Add bubble effect
    bubble_effect(lyric)
    
    # Update popup window
    if popup:
        clean_lyric = lyric.replace('\n', ' ')
        popup.window.after(0, lambda: popup.update_lyric(clean_lyric))

def sing_song():
    lyrics = [
        ("Did we ever know?", 0.07),
        ("Did we ever know?", 0.07),
        ("Did we ever know?", 0.12),
        ("Is it all inside of my head?", 0.08),
        ("Maybe you still think I don't care", 0.07),
        ("But all I need is you", 0.08),
        ("Yeah, you know it's true", 0.05),
        ("yeah, you know it's true", 0.05),
        ("Forget about where we are and let go", 0.11),
        ("We're so close", 0.09)
    ]
    delays = [0.3, 2.4, 4.1, 8.0, 11.9, 15.9, 18.5, 20.5, 22.7, 28.0]
    
    # Create popup window in separate thread
    popup = LyricsPopup()
    popup_thread = Thread(target=popup.start, daemon=True)
    popup_thread.start()
    
    time.sleep(0.5)  # Wait for window to initialize
    
    # Start bubble animation
    bubble_animator = Thread(target=popup.animate_bubbles, daemon=True)
    bubble_animator.start()
    
    # Start singing threads
    threads = []
    for i in range(len(lyrics)):
        lyric, speed = lyrics[i]
        t = Thread(target=sing_lyric, args=(lyric, delays[i], speed, popup))
        threads.append(t)
        t.start()
    
    for thread in threads:
        thread.join()
    
    print("\n" + "🌟" * 15)
    print("  ✨ Song Complete! ✨  ")
    print("🌟" * 15 + "\n")

if __name__ == "__main__":
    try:
        sing_song()
    except KeyboardInterrupt:
        print("\n\n🎵 Goodbye! 🎵")
        sys.exit(0)