export interface Jerv {
  artsIDAnalyse: string,
  artsIDPrøve: string,
  datatype: string,
  dato: string,
  dnaID: string,
  funnsted: string,
  id: string,
  kjønnID: string,
  kommune: string,
  prøvestatusID: string,
  prøvetypeID: string,
  rovdyrArtsID: string,
  strekkode: string,
  vueringID: string,
  wkt: string,
  latitude: number,
  longitude: number
}

interface SearchFilter {
  carnivore: number[],
  carnivoreDamage: number[],
  evaluation: number[],
  observation: number[],
  offspring: string,
  fromDate: string,
  toDate: string,
  country: [],
  region: [],
  county: [],
  municipality: [],
  individualNameOrID: string,
  barcode: string,
  rovdjursforum: string,
  iD: string
}

/*
"LanguageCode": "no",
"SearchFilter": {
    "Carnivore": [
        3,
        4
    ],
    "CarnivoreDamage": [
        1,
        2,
        3,
        4,
        5
    ],
    "Evaluation": [
        1,
        2,
        3
    ],
    "Observation": [
        1,
        2,
        3,
        12,
        11
    ],
"Offspring": false,
"FromDate": "2022-01-12T00:00:00.000Z",
"ToDate": "2022-02-11T00:00:00.000Z",
"Country": [],
"Region": [],
"County": [],
"Municipality": [],
"IndividualNameOrID": "",
"Barcode": "",
"Rovdjursforum": false,
"ID": ""*/