import json
import csv

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

def convert_new_data_0_csv_to_json():
    data = []
    with open('../data/new_data_0.csv', 'r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            data.append(row)
    
    with open('../data/new_stud_data_0.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    
    print("################# \n populated data/new_stud_data_0.json successfully!\n#################")


with open("../data/students.json", "r") as file:
    contents = json.load(file)


# put all the names and countries in proper case.
def proper_case():
    # initialize a counter to count the number of changes made overall.
    i = 0
    for student in contents:
        student["NAME"] = student["NAME"].title().strip()
        i += 1

    # put all the country names in proper case.

    for student in contents:
        student["COUNTRY"] = student["COUNTRY"].title().strip()
        i += 1
    
    # put all the country codes in upper case.
    for student in contents:
        student["CODE"] = student["CODE"].upper().strip()
        i += 1
    
    #put all the awards in proper case.
    for student in contents:
        student["AWARD"] = student["AWARD"].title().strip()
        i += 1

    # put all PAMOG awards in propers case.
    for student in contents:
        student["PAMOG"] = student["PAMOG"].title().strip()
        i += 1
    
    #put all the status in proper case.
    for student in contents:
        student["STATUS"] = student["STATUS"].title().strip()
        i += 1
    
    print(f"there were {i} Proper chase changes made overall.")

# Check for misspelled countries in the data and print them out.

def check_misspelled_countries():
    countries_in_pamo = set()
    for country in contents:
        countries_in_pamo.add(country["COUNTRY"])

    all_african_countries = ["Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Congo-Brazzaville", "Democratic Republic of the Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda",]
    all_african_countries += ["Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia","South Africa", "South Sudan", "Sudan","Tanzania","Togo","Tunisia","Uganda","Zambia","Zimbabwe"]

    # check if all the countries in pamo are in the list of african countries.

    missspelled_countries = []
    for country in countries_in_pamo:
        if country not in all_african_countries:
            missspelled_countries.append(country)

    print(missspelled_countries)

# check if a country is misspelled.

def check_it(country):
    for student in contents:
        if student["COUNTRY"] == country:
            print(f"the year is {student['YEAR']} the student is {student['NAME']}")

# Change the misspelled country to the correct one.
def change_it(country, new_country):
    for student in contents:
        if student["COUNTRY"] == country:
            student["COUNTRY"] = new_country
    print(f"the country {country} has been changed to {new_country}")

#Update the original json file.
def update_main():
    with open("../data/students.json", "w") as file:
        json.dump(contents, file, indent=2)
    print("finished updating the json!")


# check on all the country codes.

def check_country_codes():
    country_codes = set()
    for student in contents:
        country_codes.add(student["CODE"])

    # print(f"{country_codes}")
    # print(f"there are {len(country_codes)} country codes")
    return country_codes



#matching the country and the right code.
def match_country_and_code():

    all_countries_in_PAMO = ['Algeria', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cameroon', 'Congo-Brazzaville', 'Democratic Republic Of The Congo', 'Djibouti', 'Egypt', 'Eswatini', 'Ethiopia', 'Gambia', 'Ghana', 'Ivory Coast', 'Kenya', 'Lesotho', 'Libya', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Senegal', 'Sierra Leone', 'South Africa', 'South Sudan', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zimbabwe']
    all_codes = ['ALG', 'BDI', 'BEN', 'BFA', 'BOT', 'CAM', 'COB', 'DJI', 'DRC', 'EGY', 'ESW', 'ETH', 'GHA', 'GMB', 'IVC', 'KEN', 'LBY', 'LES', 'MLI', 'MLW', 'MOR', 'MOZ', 'MTN', 'MTS', 'NAM', 'NGA', 'NGR', 'RWA', 'SAF', 'SEN', 'SIE', 'SSD', 'TAN', 'TOG', 'TUN', 'UGA', 'ZIM']
    
    country_and_code = [
        {"country": "Algeria", "code": "ALG"},
        {"country": "Benin", "code": "BEN"},
        {"country": "Botswana", "code": "BOT"},
        {"country": "Burkina Faso", "code": "BFA"},
        {"country": "Burundi", "code": "BDI"},
        {"country": "Cameroon", "code": "CAM"},
        {"country": "Congo-Brazzaville", "code": "COB"},
        {"country": "Democratic Republic Of The Congo", "code": "DRC"},
        {"country": "Djibouti", "code": "DJI"},
        {"country": "Egypt", "code": "EGY"},
        {"country": "Eswatini", "code": "ESW"},
        {"country": "Ethiopia", "code": "ETH"},
        {"country": "Gambia", "code": "GMB"},
        {"country": "Ghana", "code": "GHA"},
        {"country": "Ivory Coast", "code": "IVC"},
        {"country": "Kenya", "code": "KEN"},
        {"country": "Lesotho", "code": "LES"},
        {"country": "Libya", "code": "LBY"},
        {"country": "Malawi", "code": "MLW"},
        {"country": "Mali", "code": 	"MLI"},
        {"country": "Mauritania",	"code":"MTN" },
        {"country":"Mauritius","code":"MTS" },
        {"country":"Morocco","code":"MOR" },
        {"country":"Mozambique","code":"MOZ" },
        {"country":"Namibia","code":"NAM" },
        {"country":"Niger","code":"NGR" },
        {"country":"Nigeria","code":"NGA" },
        {"country":"Rwanda","code":"RWA" },
        {"country":"Senegal","code":"SEN" },
        {"country":"Sierra Leone","code":"SIE" },
        {"country":"South Africa","code":"SAF" },
        {"country":"South Sudan","code":"SSD" },
        {"country":"Tanzania","code":"TAN" },
        {"country":"Togo","code":"TOG" },
        {"country":"Tunisia","code":"TUN" },
        {"country":"Uganda","code":"UGA" },
        {"country":"Zimbabwe","code":"ZIM" }
    ]

    #initialize a counter to count the number of mismatches.
    mismatch = 0

    for student in contents:
        for itm in country_and_code:
            if student["COUNTRY"] == itm["country"]:
                if student["CODE"] != itm["code"]:
                    if student["CODE"] != "":
                        student["CODE"] = itm["code"]
                        mismatch += 1
    print(f"Corrected {mismatch} mismatches in total.")


#checking for duplicates.
def check_similar_names():
    names = []
    for student in contents:
        if student["NAME"] not in names:
            names.append(student["NAME"])
        else:
            print(f"This guy appears many times: {student['NAME']}")

    print(len(names))

#clean the awards.

def clean_hM():
    counter = 0
    for student in contents:
        if student["AWARD"] == "Hm":
            student["AWARD"] = "Honorable Mention"
            counter += 1
        if student["AWARD"] == "Honourable Mention":
            student["AWARD"] = "Honorable Mention"
            counter += 1
        if student["AWARD"] == "Certificate":
            student["AWARD"] = "Certificate Of Recognition"
            counter += 1
    print(f"Finished cleaning. Corrected {counter} entries.")

#trim everything in the json file.
def trim_all():
    counter = 0
    for student in contents:
        for key in student:
            if isinstance(student[key], str):
                student[key] = student[key].strip()
                counter += 1
    print(f"Finished trimming. Trimmed {counter} entries.")
