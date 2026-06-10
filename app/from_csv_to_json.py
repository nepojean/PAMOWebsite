import csv
import json

# Code for changing csv file into json file. 
#run the following function only once otherwise you'll overwrite your clean json file.
def convert_students_csv_to_json():
    data = []
    with open('../data/students.csv', 'r', encoding='utf-8') as f:
        csv_reader = csv.DictReader(f)
        for row in csv_reader:
            data.append(row)

    with open('data/students.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)

    print("populated data/students.json successfully!")

def convert_countries_csv_to_json():
    data = []
    with open('../data/countries.csv', 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)
    
    with open('../data/countries.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print("################# \n populated data/countries.json successfully!\n#################")

convert_countries_csv_to_json()
