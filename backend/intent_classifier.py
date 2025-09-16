import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments, pipeline

#before running: pip install transformers torch pandas scikit-learn datasets
'''overall flow:
1.loading and preping
2.tokenizing using distilBERT
3.fine tuning distilbert model for our intent
4.performance evaluation
5.inference of model-its going to create the huggingface
pipeline for getting the predictions
6.testing output
'''

#Loading and Preping Dataset
df = pd.read_csv('intents_large.csv')

# mappings for labels to integers and back
labels = df['intent'].unique().tolist()
id2label = {i: label for i, label in enumerate(labels)}
label2id = {label: i for i, label in enumerate(labels)}
df['label'] = df['intent'].map(label2id)


train_df, test_df = train_test_split(df, test_size=0.2, random_state=42, stratify=df['label'])

# Hugging Face Dataset objects conversion
train_dataset = Dataset.from_pandas(train_df)
test_dataset = Dataset.from_pandas(test_df)

#used a DistilBERT Tokenizer to tokenize the Data and function to tokenize the text
tokenizer = AutoTokenizer.from_pretrained("distilbert-base-uncased")

def tokenize_data(examples):
    return tokenizer(examples['utterance'], padding="max_length", truncation=True)

tokenized_train_dataset = train_dataset.map(tokenize_data, batched=True)
tokenized_test_dataset = test_dataset.map(tokenize_data, batched=True)
print("Data tokenized successfully.")

#  here ive Fine-Tuned the DistilBERT Model to match it our needs

# its a pre-trained DistilBERT model for sequence classification
model = AutoModelForSequenceClassification.from_pretrained(
    "distilbert-base-uncased",
    num_labels=len(labels),
    id2label=id2label,
    label2id=label2id
)


training_args = TrainingArguments(
    output_dir="./distilbert-intent-classifier",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
    eval_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
)

#Trainer intialization
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized_train_dataset,
    eval_dataset=tokenized_test_dataset,
)

#training process
print("\n Starting DistilBERT fine-tuning")
trainer.train()
print("Model training complete.")

#evaluation

print("\n Evaluating model performance:")
predictions, label_ids, _ = trainer.predict(tokenized_test_dataset)
y_pred_ids = np.argmax(predictions, axis=1)

#classification report from sklearn
print("\nClassification Report:")
print(classification_report(label_ids, y_pred_ids, target_names=labels))

# testing the model for inference

print("\nUsing the fine-tuned model for predictions:")

# Using the built in huggingface pipeline for easy inference on new sentences
# so this will load the best model needed
intent_classifier_pipeline = pipeline("text-classification", model=trainer.model, tokenizer=tokenizer)

# testing eg
query1 = "what is the deadline for fee payment?"
result1 = intent_classifier_pipeline(query1)
print(f"Query: '{query1}' -> {result1}")

query2 = "Where can I find the scholarship form?"
result2 = intent_classifier_pipeline(query2)
print(f"Query: '{query2}' -> {result2}")

query3 = "Bye"
result3 = intent_classifier_pipeline(query2)
print(f"Query: '{query3}' -> {result3}")