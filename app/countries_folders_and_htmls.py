import json
import os


#create the index.html files first for ../countries

def create_index_for_countries():
    folders = ["../countries"]

    for folder in folders:
        filepath = os.path.join(folder, "index.html")

    print(f"Created {filepath}")

    html_template = """
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Countries | PAMO</title>

<meta name="description"
      content="Official website of the Pan African Mathematics Olympiad (PAMO).">

<link rel="icon" href="../img/pamo_icon.ico">

<link rel="stylesheet" href="../css/design.css">
<link rel="stylesheet" href="../css/index.css">
<link rel="stylesheet" href="../css/print.css" media="print">

</head>

<body>

    <header id="header">
    <div id="h1">
        <h1><a href="../.">PAMO</a></h1>
    </div>
    <div>
        <div id="menu">
            <a href="../timeline/.">Timeline</a> 
            <a href="../countries/.">Countries</a> 
            <a target="_blank" href="https://artofproblemsolving.com/community/c3228_pan_african">Problems</a> 
            <a href="../committee/.">AMUPAMOC Members</a> 
            <a href="../imoparticipation/.">IMO Participation</a> 
            <a href="../regulations/.">Regulations</a>
        </div>
        <div id="search-wrap">
            <input type="text" id="searchInput" placeholder=" Student Search ..." aria-label="Search" />
        </div>
    </div>
</header>

<div id="main">
	<h2>List of countries</h2>
	<table>
	<thead>
	<tr>
        <th rowspan="2">Code <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th rowspan="2">Country <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th title="Gold medal">Gold <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th title="Silver medal">Silver <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th title="Bronze medal">Bronze <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th title="Honourable mention">HM <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th rowspan="2">National Website</th>
        <th rowspan="2">PAMO Host</th>
        <th title="number of participations">Participations↕ </th>
        <th title="last participation"> Recent↕ </th>
	</tr>
	</thead>
	<tbody>
	</tbody>
	</table>
</div>

<footer id="footer">
<b>Webmaster:</b>
<a href="mailto:tech@africanolympiadfoundation.org">tech@africanolympiadfoundation.org</a>
</footer>
<script src="../js/countries.js"></script>
</body>
</html>

"""

    with open(filepath, "w") as myfile:
        myfile.write(html_template)
    print(f"populated or updated {filepath} with html code.")



def create_folders_in_countries():
    folder = "../countries"
    all_countries = set()

    with open("../data/students.json", "r") as myfile:
        contents = json.load(myfile)
    
    for student in contents:
        if student["CODE"] != "":
            all_countries.add(student["CODE"])
    
    for country in all_countries:
        os.makedirs(os.path.join(folder, country), exist_ok=True)
    
    print(f"Created {len(all_countries)} countries.")

def create_htmls_in_subfolders():
    folder = "../countries"
    all_countries = set()

    with open("../data/students.json", "r") as myfile:
        contents = json.load(myfile)
    
    for student in contents:
        if student["CODE"] != "":
            all_countries.add(student["CODE"])
    html_template = """
"""
    for country in all_countries:
        filepath = os.path.join(folder, country, "index.html")
        with open(filepath, "w") as myfile:
            myfile.write(html_template)
    
    print(f"Created {len(all_countries)} index.html files in subfolders.")

def populate_htmls_in_subfolders():
    folder = "../countries"
    all_countries = set()

    with open("../data/students.json", "r") as myfile:
        contents = json.load(myfile)
    
    for student in contents:
        if student["CODE"] != "":
            all_countries.add(student["CODE"])
    
    for country in all_countries:
        filepath = os.path.join(folder, country, "index.html")
        html_content = """
<!DOCTYPE html>
<html lang="en">
<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">

<title>Countries | PAMO</title>

<meta name="description"
      content="Official website of the Pan African Mathematics Olympiad (PAMO).">

<link rel="icon" href="../../img/pamo_icon.ico">

<link rel="stylesheet" href="../../css/design.css">
<link rel="stylesheet" href="../../css/index.css">
<link rel="stylesheet" href="../../css/print.css" media="print">

</head>
<body>

<header id="header">
    <div id="h1">
        <h1><a href="../../.">PAMO</a></h1>
    </div>
    <div>
        <div id="menu">
            <a href="../../timeline/.">Timeline</a> 
            <a href="../../countries/.">Countries</a> 
            <a target="_blank" href="https://artofproblemsolving.com/community/c3228_pan_african">Problems</a> 
            <a href="../../committee/.">AMUPAMOC Members</a> 
            <a href="../../imoparticipation/.">IMO Participation</a> 
            <a href="../../regulations/.">Regulations</a>
        </div>
        <!-- <div id="search-wrap">
            <input type="text" id="searchInput" placeholder=" Student Search ..." aria-label="Search" />
        </div> -->
    </div>
</header>

<div id="results" style="display: none;"></div>

<div id="main">
    <div class="flag">
        <a href=".">
        <img title="country" class="countryFlag" style="border-width:0px;" />
        </a>
    </div>

    <h2 class = "countryName"></h2>

    <h3>
    Official Contestants
    </h3>    
    <section class="results-section">
        <div class="table-scroll">
    <table class = "results-table">
    <thead>
    <tr><th class="highlightDown nosort">Year</th>
        <th class="nosort">Contestant</th>
        <th>P1 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P2 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P3 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P4 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P5 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P6 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>Total <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>Rank <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>Award <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>PAMOG <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
    </tr>
    </thead>
    <tbody></tbody>
    </table>
        </div>
    </section>

    <h3>
    Unofficial Contestants
    </h3>    
    <section class="results-section unofficial">
        <div class="table-scroll">
    <table class = "results-table">
    <thead>
    <tr><th class="highlightDown nosort">Year</th>
        <th class = "nosort">Contestant</th>
        <th>P1 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P2 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P3 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P4 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P5 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>P6 <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>Total <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>Rank <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
        <th>Award <span style="font-size: 80%; opacity: 0.6;">↕</span></th>
    </tr>
    </thead>
    <tbody></tbody>
    </table>
        </div>
    </section>

    <div>
        Results may be incomplete or incorrect.
        Please send the relevant information to the webmaster:
        <a href="mailto:tech@africanolympiadfoundation.org">tech@africanolympiadfoundation.org</a>.
        <br>
        If you are a participant you can send a personal page URL to be attached
        to your name.
    </div>
    <br>
</div>
<footer id="footer">
<a href="http://ipho-new.org/" target="_blank"></a>
<a href="javascript:easteregg()" style="color: black;"></a>
<b>Webmaster:</b>
<a href="mailto:tech@africanolympiadfoundation.org">tech@africanolympiadfoundation.org</a>
</footer>

<script src="../../js/countriesyears.js"></script>

</body>
</html>
"""

        with open(filepath, "w") as myfile:
            myfile.write(html_content)
    print("done populating htmls in subfolders of country.")


