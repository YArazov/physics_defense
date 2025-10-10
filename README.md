## physics_defense
A simple 2D single-player browser tower defense game with a custom physics engine. Fling arrows and stones at endless waves of enemies to protect your castle. Earn coins, stack boxes, and build your defenses higher and stronger as you upgrade your fortress.

## Project Structure

```
physics_defense/
├── main.js        # Main JavaScript module for the application
├── index.html     # Main HTML document containing the canvas
├── README.md      # Documentation for the project
├── game/
│   ├── world.js           # Manages game world state and entities
│   ├── shapes/
│   │   ├── shape.js       # Base Shape class/interface
│   │   ├── rectangle.js   # Rectangle shape logic
│   │   ├── circle.js      # Circle shape logic
│   │   └── ...            # Other shapes (polygon.js, etc.)
│   └── properties.js      # Handles properties (health, position, etc.)
├── physics/
│   ├── engine.js          # Main physics engine logic
│   ├── collision.js       # Collision detection and resolution
│   ├── forces.js          # Force application (gravity, drag, etc.)
│   └── ...                # Other physics utilities
└── assets/
    └── ...    
```

Key Points:

All game world logic (entities, shapes, properties) goes in the game/ folder.
Each shape type gets its own file in game/shapes/ for modularity.
Physics-related code is isolated in the physics/ folder.
Assets (images, sounds) are kept in an assets/ folder.

## Files Description

- **main.js**: This file serves as the main JavaScript module for the application. It will contain the logic for initializing the canvas and any future drawing functionalities. It will be imported into the HTML file.

- **index.html**: This file is the main HTML document for the application. It includes a canvas element with a specified ID, and it imports the `main.js` module to execute the JavaScript code.

## Setup Instructions

1. Clone the repository to your local machine:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd canvas-app
   ```

3. Open `index.html` in a web browser to run the application.

## Next Features -- Implementation Order

1. **Basic Shape Rendering**
   - Implement rendering for rectangles and circles on the canvas.
2. **Shape Properties**
   - Add position, velocity, and mass properties to shapes.
3. **Physics Engine Core**
   - Develop basic physics update loop (position/velocity integration).
4. **Collision Detection**
   - Implement collision detection between shapes.
5. **Collision Resolution**
   - Add response logic for shape collisions (bounce, stop, etc.).
6. **Force Application**
   - Integrate gravity and user-applied forces (e.g., fling).
7. **Game World Management**
   - Track and update all entities in the game world.
   - Separate or move some of the code from main.js into world.js, which code
   is related to keeping track of game objects or entities while main.js will be
   responsible for just the game loop logic 
8. **Basic Game Mechanics**
   - Add simple enemy and projectile logic.
9. **User Interaction**
   - Allow user to launch projectiles (arrows, stones).
10. **Tower Defense Features**
    - Implement enemy waves, castle health, and upgrades.