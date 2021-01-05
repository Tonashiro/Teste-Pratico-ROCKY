// Autor: Vinicius Tonashiro de Souza
// Fontes e trechos de códigos utilizados dos sites: https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
//                                                   https://www.w3schools.com/jsref/

const fs = require("fs");

//------------------- Leitura do arquivo corrompido -------------------//
const loadDatabase = JSON.parse(fs.readFileSync("broken-database.json", "utf8"));


//------------------- Correção dos nomes dos produtos -------------------//
function correctNames(database){
    
    database.forEach((product) => {
        let correctName = product.name;

        for (let i = 0; i < correctName.length; i++) {
            switch (correctName[i]) {
                case "æ":
                    correctName = correctName.replace(correctName[i], "a");
                    break;
                case "¢":
                    correctName = correctName.replace(correctName[i], "c");
                    break;
                case "ø":
                    correctName = correctName.replace(correctName[i], "o");
                    break;
                case "ß":
                    correctName = correctName.replace(correctName[i], "b");
                    break;
                }
        }
        product.name = correctName;
    })
}

//------------------- Correção dos preços dos produtos -------------------//
function correctPrices(product) {

    for(i = 0; i < product.length; i++) {
        product[i].price = parseFloat(product[i].price);
    }
}

//------------------- Inserção do item "quantidade" nos produtos que não possuem -------------------//
function correctQty(product) {
        
    product.forEach((product) => {
        if (product.quantity == null) 
            product.quantity = 0;
    })
}

//------------------- Ordenação dos produtos por categoria e ID -------------------//
function sortCatId(a, b) {
    
    const categoryA = a.category.toUpperCase();
    const categoryB = b.category.toUpperCase();

    let comparison = 0;
    
    //------- Comparação das categorias -------//
    if (categoryA > categoryB) {
        comparison = 1;
    } 
        else if (categoryA < categoryB) {
            comparison = -1;
        }
    
        //------- Se as categorias forem iguais, compara os ID's -------//
        if (comparison == 0){
            if (a.id > b.id) {
                comparison = 1
            } 
            else {
                comparison = -1
            }
        }

    return comparison;
}

//------------------- Output dos items ordenados -------------------//
function sortItems(product) {
    
    product.sort(sortCatId);
    
    console.table(product, ["category", "id", "name"]);
}

//------------------- Calculo do valor total do estoque por categoria -------------------//
function categoryStockValue(product) {
    
    let stock = [{
        cat: product[0].category,
        stockValue: product[0].quantity * product[0].price      
    }],
        index = 0;
    
    //------- Percorre todos os produtos e compara categoria, somando o valor de estoque de cada uma. No caso de não for mesma categoria, é passado para o proximo indice -------//
    for(i = 1; i < product.length; i++) {
        if (stock[index].cat != product[i].category) {
            index++;
            stock.push({
                cat: product[i].category,
                stockValue: product[i].quantity * product[i].price
            })
        } 
        else {
            stock[index].stockValue += product[i].quantity * product[i].price;   
        }        
    }

    console.table(stock);
}


//------------------- Exportando o arquivo corrigido -------------------//
function exportDatabase(database){
    fs.writeFileSync("fixed-database.json", JSON.stringify(database, null, 1));
}


var database = loadDatabase;

correctNames(database);

correctPrices(database);

correctQty(database);

sortItems(database);

categoryStockValue(database);

exportDatabase(database);

fs.writeFileSync("saida.json", JSON.stringify(database, null, 1));


