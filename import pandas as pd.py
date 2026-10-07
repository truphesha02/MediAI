import pandas as pd
from sklearn.linear_model import LogisticRegression

# 1. LOAD
data = {
    "Hours": [2, 5, 1, 6, 3, 8, 4, 7],
    "Marks": [40, 70, 30, 80, 50, 90, 65, 85],
    "Result": [0, 1, 0, 1, 0, 1, 1, 1]
}

df = pd.DataFrame(data)
print("Original Data:")
print(df)

# 2. CLEAN
df = df.drop_duplicates()
df = df.dropna()

# 3. TRAIN
X = df[["Hours", "Marks"]]
y = df["Result"]

model = LogisticRegression()
model.fit(X, y)

print("\nModel Trained Successfully!")

# 4. PREDICT
new_student = [[5, 75]]
prediction = model.predict(new_student)

if prediction[0] == 1:
    print("Prediction: PASS")
else:
    print("Prediction: FAIL")