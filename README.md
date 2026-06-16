# VVISC IUCEE Chapter - Landing Page

Welcome to the official landing page repository for the **VVISC IUCEE Chapter**. This is a modern, highly interactive, and fully responsive single-page web application designed to showcase the club's initiatives, departments, and events.

## 🚀 Features

- **Earth-Toned Aesthetics**: A sophisticated, grounded color palette featuring warm beige, deep browns, and forest greens.
- **Dynamic Dark/Light Mode**: Fully integrated theme toggler that seamlessly switches the UI between an elegant light mode and a sleek dark mode.
- **Interactive 3D Robot**: Features a custom Spline 3D model (Greeting Robot) integrated seamlessly into the hero section that follows the user's cursor.
- **Cinematic Scroll Animation**: A custom 160-frame canvas scroll animation that scrubs smoothly as the user scrolls down the introduction section.
- **Fully Responsive Layout**: Built with a mobile-first philosophy. Gracefully adapts to laptops, tablets (iPads), and mobile phones dynamically.
- **Modern UI/UX**: Includes frosted glass navbars (backdrop-filters), smooth CSS transitions, interactive event cards, and clean typography (Outfit font).

## 🛠️ Tech Stack

- **HTML5**: Semantic markup and layout structure.
- **CSS3**: Vanilla CSS utilizing CSS Variables, Flexbox, Grid, Media Queries, and modern functions like `clamp()` and Dynamic Viewport Heights (`dvh`).
- **JavaScript**: Vanilla JS for intersection observers (fade-in animations), scroll-bound canvas frame rendering, and theme toggling.
- **Spline**: Interactive 3D web embedding.

## 🏃‍♂️ How to Run Locally

Because this project uses HTML5 Canvas to draw local images (the scroll animation frames), running it directly by double-clicking the `index.html` file will result in a CORS (Cross-Origin Resource Sharing) error in your browser. 

You must run it through a local web server.

### Option 1: Python (Recommended)
If you have Python installed, open your terminal in the project folder and run:
```bash
python -m http.server 8080
```
Then, open your browser and navigate to `http://localhost:8080`.

### Option 2: VS Code Live Server
If you use Visual Studio Code, you can install the **Live Server** extension. 
Right-click on `index.html` and select **"Open with Live Server"**.

### Option 3: Node.js (http-server)
If you have Node.js installed, you can use `npx`:
```bash
npx http-server -p 8080
```

## 📁 Project Structure

- `index.html`: The main markup file.
- `style.css`: All responsive styling and theme variables.
- `main.js`: Scroll animation logic, dark mode toggling, and intersection observers.
- `assets/`: Contains the logo and static gallery imagery.
- `frames/`: Contains the 160 sequence images for the canvas scroll animation.
