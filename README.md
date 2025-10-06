Technology I used to use:
column A: full name
column B: country name
Column C: country code
Column D: Rank
Column E: PAMO medal
column F: PAMOG medal
Column G: P1
Column H: P2
Column I: P3
Column J: P4
Column K: P5
Column L: P6
Column M: Total

Column N:
=CONCATENATE(
"<tr><td>", A2, "</td>",
"<td><a href=""../../countries/", C2, "/individual.html"">", B2, "</a></td>",
"<td align=""right"">", D2, "</td>",
"<td><img src=""../../img/", E2, ".png"" width=""9"" height=""9""> ", E2, "</td><td>", F2,"</td>",
"<td align=""right"">", G2, "</td>",
"<td align=""right"">", H2, "</td>",
"<td align=""right"">", I2, "</td>",
"<td align=""right"">", J2, "</td>",
"<td align=""right"">", K2, "</td>",
"<td align=""right"">", L2, "</td>",
"<td align=""right"">", M2, "</td></tr>"
)

Then after getting the html code I use it in table representation. But now, I am going to use backend technology.