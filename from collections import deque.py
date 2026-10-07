from collections import deque

# Goal state
GOAL = (1, 2, 3,
        4, 5, 6,
        7, 8, 0)

# Print the puzzle
def print_puzzle(state):
    for i in range(0, 9, 3):
        print(state[i], state[i + 1], state[i + 2])
    print()


# Generate possible next states
def get_neighbors(state):
    neighbors = []

    # Position of blank space (0)
    zero_pos = state.index(0)
    row = zero_pos // 3
    col = zero_pos % 3

    # Possible movements: Up, Down, Left, Right
    moves = {
        "Up": (-1, 0),
        "Down": (1, 0),
        "Left": (0, -1),
        "Right": (0, 1)
    }

    for move, (dr, dc) in moves.items():
        new_row = row + dr
        new_col = col + dc

        # Check if movement is inside the puzzle
        if 0 <= new_row < 3 and 0 <= new_col < 3:

            new_pos = new_row * 3 + new_col

            # Create new state
            new_state = list(state)
            new_state[zero_pos], new_state[new_pos] = (
                new_state[new_pos],
                new_state[zero_pos]
            )

            neighbors.append((tuple(new_state), move))

    return neighbors


# BFS Algorithm
def solve_8_puzzle(initial_state):

    queue = deque()
    queue.append((initial_state, []))

    visited = set()
    visited.add(initial_state)

    while queue:

        current_state, path = queue.popleft()

        # Goal reached
        if current_state == GOAL:
            return path

        # Generate next states
        for next_state, move in get_neighbors(current_state):

            if next_state not in visited:
                visited.add(next_state)

                queue.append(
                    (next_state, path + [(move, next_state)])
                )

    return None


# ---------------- MAIN PROGRAM ----------------

print("===== 8 PUZZLE PROBLEM =====")

print("\nEnter the initial state.")
print("Use 0 for the blank space.")
print("Example: 1 2 3 4 0 6 7 5 8")

numbers = list(map(int, input("Enter 9 numbers: ").split()))

if len(numbers) != 9 or set(numbers) != set(range(9)):
    print("Invalid input!")
    print("Please enter numbers 0 to 8 exactly once.")
    exit()

initial_state = tuple(numbers)

print("\nInitial State:")
print_puzzle(initial_state)

# Solve puzzle
solution = solve_8_puzzle(initial_state)

if solution is None:

    print("No solution found.")

else:

    print("Solution found!")
    print("Number of moves:", len(solution))

    current = initial_state

    print("\nInitial State:")
    print_puzzle(current)

    for i, (move, state) in enumerate(solution, 1):

        print("Step", i, "- Move:", move)
        print_puzzle(state)

    print("Goal State reached!")
    