class Zamestnanec {
    constructor(IDNation, Nation, UnitedStates, IDYear, Year, Population, SlugNation){
        this.IDNation = IDNation;
        this.Nation = Nation;
        this.UnitedStates = UnitedStates;
        this.IDYear = IDYear;
        this.Year = Year;
        this.Population = Population;
        this.SlugNation = SlugNation;
    }
}

const zamestnanci = [];
const vypis = document.querySelector(".vypis");

function reqListener() {
    vypis.textContent = this.responseText;
    vypis.textContent += zamestnanci[1];
}

const req = new XMLHttpRequest();
req.addEventListener("load", reqListener);
req.open(
    "GET",
    "https://datausa.io/api/data?drilldowns=Nation&measures=Population"
)
req.send();
req.onload = () => {
    let data = JSON.parse(req.responseText);
    data["data"].forEach(element => {
        let z = new Zamestnanec(element.IDNation, element.Nation, element.UnitedStates, element.IDYear, element.Year, element.Population, element.SlugNation);
        zamestnanci.push(z);
    });
}

localStorage.setItem("zamestnanci", JSON.stringify(zamestnanci));

