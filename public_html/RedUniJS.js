//Red Unicorn
//Code by Charles Wentzel
////////////////////
//GLOBAL VARIABLES//
////////////////////

//contains symbols of companies to include in table
var CompanyDirectory = [];
//contains stat fields to be included in table
var DisplayedFields = ['symbol'];
//strings to make requests to YQL
//var requestpre = "https://query.yahooapis.com/v1/public/yql?q=";
//var requestpost = "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
yqlpreObj = {analystestimate: 'SELECT * FROM yahoo.finance.analystestimate WHERE symbol="', balancesheet: 'SELECT * FROM yahoo.finance.balancesheet WHERE symbol="', cashflow: 'SELECT * FROM yahoo.finance.cashflow WHERE symbol="', incomestatement: 'SELECT * FROM yahoo.finance.incomestatement WHERE symbol="', keystats: 'SELECT * FROM yahoo.finance.keystats WHERE symbol="', quant: 'SELECT * from yahoo.finance.quant WHERE symbol in ("', quant2: 'SELECT * from yahoo.finance.quant2 WHERE symbol in ("', quote: 'SELECT * from yahoo.finance.quote WHERE symbol in ("', stocks: 'SELECT * from yahoo.finance.stocks WHERE symbol="'};
yqlpostObj = {analystestimate: '"', balancesheet: '"', cashflow: '"', incomestatement: '"', keystats: '"', quant: '")', quant2: '")', quote: '")', stocks: '"'};
yqltablekey = ['analystestimate','balancesheet','cashflow','incomestatement','keystats','quant','quant2','quote','stocks'];



///////////////////////
//OBJECT CONSTRUCTORS//
///////////////////////


function Stat(label){
    this.label = label;
};
function TableObject(){
    this.id = 'TableObject';
    this.sortedby = '';
};
function Company(symbol){
    this.symbol = symbol;
    };




///////////////////////
//STAT OBJECT METHODS//
///////////////////////

//document ready method to get the names of the fields in the data JSONs
//stores data in array called Statfields in Stat object
//$(Stat.prototype.GetFields = function(){
//    var yql = encodeURIComponent('select * from yahoo.finance.keystats where symbol in ("A")');
//    var request = yqlpre + yql + yqlsuf;
//    $.ajax({
//        type: 'GET',
//        url: request,
//        datatype: 'json',
//        success: function(data){
//            Stat.StatFields = Object.getOwnPropertyNames(data.query.results.quote);           
//            for (z=0;z<Stat.StatFields.length;z++){
//                var newpropname = Stat.StatFields[z];
//                var statobj = window.Stat;
//                statobj[newpropname] = [];
//            }
//            TableObject.AddFieldDivs();
//        }
//    });
//});

//method to update Stat object each time company added 
Stat.UpdateStatArrays = function(compobj){
    //get StatFields  ERASE MAYBE
    var statfields = Stat.StatFields;
    //must iterate through stats of each company and add to correct array in Stat Object
    for (j=0;j<Stat.StatFields.length;j++){
        //get a stat string to get correct stat from company
        var statfield = Stat.StatFields[j];
        //use stat string to get correct stat from company
        var stat = compobj[statfield];
        //use method to cast data into type
        var stattyped = Stat.ConvertDataType(stat);
        //use stat string to get field to get correct array from Stat Object
        var statarray = Stat[statfield];
        //form mini array to add to statarray
        var miniarray = [];
        miniarray[0] = compobj.symbol;
        miniarray[1] = stattyped;
        //add miniarray to approprate stat array using push method
        statarray.push(miniarray);
    };
};

//method to detect types of data.
Stat.ConvertDataType = function (item){
    if ($.type(item) === 'null'){
        return $.type(item);
    }
    else if ($.isNumeric(item) === true){
        var itemtrm = item.trim();
        return parseFloat(itemtrm);
    }
    //see if percentage (check if contains % character)
    else if (item.indexOf('%') > -1) {
        var sanspct = item.replace('%','');
        var number = parseFloat(sanspct);
        if(isNaN(number) === true){
            return item;
        }
        else{
            return number;
        }
    }
    else {
        return item;
    };
};
    

//method to sort stat fields
//iterate over a stat fiel
Stat.SortStatArray = function (field,direction){
    //get correct stat array
    var statarr = this[field];
    //make testitem to get type
    var testitem = statarr[0][1];
    var itemtype = $.type(testitem);
    if (itemtype === 'number'){
        if (direction === 'up'){
            statarr.sort(function(a,b){
                return a[1] - b[1];
            });
        }
        else if (direction === 'down'){
            statarr.sort(function(a,b){
                return b[1] - a[1];
            });
        }
        else{
            alert ('Sorting Error 1');
            return;
        }
    }
    else if (itemtype === 'string'){
        if (direction === 'up'){
            statarr.sort(function(a,b){
                a = a[1];
                b = b[1];
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a < b){
                    return -1;
                }
                if (a > b){
                    return 1;
                }
            });
        }
        else if (direction === 'down'){
            statarr.sort(function(a,b){
                a = a[1];
                b = b[1];
                a = a.toLowerCase();
                b = b.toLowerCase();
                if (a < b){
                    return 1;
                }
                if (a > b){
                    return -1;
                }
            });
        }
        else {
            alert ('Sorting Error 2');
        };
    }
    else{ 
        alert('Sorting Error 3');
    };
};
    
//method to impose the order of a particular stat array on the CompanyDirectory array
Stat.ImposeOrder = function(field){
    //get proper stat array
    var statarray = Stat[field];
    //make new array to store order
    var orderarray = [];
    //fill new array with compnay symbols
    for(u=0;u<statarray.length;u++){
        var statitem = statarray[u];
        orderarray[u] = statitem[0];            
        };
    //transfer value from orderarray to CompanyDirectory
    CompanyDirectory = orderarray;
};


////////////////////////
//TABLE OBJECT METHODS//
////////////////////////

//method to populate FieldsSelector List
TableObject.AddFieldDivs = function(){
    //get statfields array from Stat Object
    var statfields = Stat.StatFields;
    //iterate through statfields array to add each item to list
    var columncount = 1;
    for (y=0;y<statfields.length;y++){
        var statfield = statfields[y];
        var statsel = '#check_' + statfield;
        var elemid = 'check_' + statfield;
        var columnsel = '#fieldsColumn' + columncount;
        var divid = 'cont_' + statfield;
        var divsel = '#' + divid;
        $(columnsel).append('<div id="' + divid + '"></div>');
        $(divsel).append('<input id="' + elemid + '">' + statfield + '</input>');
        $(divsel).attr('class','fieldContainer');
        $(statsel).attr('type','checkbox');
        $(statsel).attr('class','fieldCheckbox');
        $(statsel).attr('id',statfield);
        $(statsel).attr('label',statfield);
        console.log(statfield);
        TableObject.AddFieldListeners(statfield);
        if (columncount === 3){
            columncount = 1;
        }
        else if (columncount < 3){
            columncount = columncount + 1;
        }
        else{
            alert('This should never happen. Error adding fields.');
        };
    };
    $('#symbol').attr('checked','true');
};

//build table. get company directory and use to iterate through companies, adding a cell for each item in DisplayedFields
TableObject.BuildTable = function(){
    //destroy old table if present
    $('#TableBody').empty();
    //add row tag for header
    $('#TableBody').append('<tr id="HeaderRow"></tr>');
    $('#HeaderRow').append('<th id="hdr_ctrl"></th>');
    //add cell tags to header rag
    for (d=0;d<DisplayedFields.length;d++){
        var headercelltext = DisplayedFields[d];
        var nexthdrcellid = 'hdr_' + DisplayedFields[d];
        var nexthdrcellsel = '#' + nexthdrcellid;
        var sortupid = 'Sortup_' + headercelltext;
        var sortdownid = 'Sortdown_' + headercelltext;
        var maxwidth = DisplayedFields.length * 50;
        var sortcontid = 'sortcont_' + DisplayedFields[d];
        var sortcontsel = '#' + sortcontid;
        maxwidth = maxwidth.toString();
        var minwidth = headercelltext.length * 9 + 20;
        $('#DataTable').css('max-width',maxwidth);
        $('#HeaderRow').append('<th id="' + nexthdrcellid + '">' + headercelltext + '</th>');
        $(nexthdrcellsel).append('<div id="' + sortcontid + '" class="Sortcont"></div>');
        $(nexthdrcellsel).css('min-width',minwidth);
        $(sortcontsel).append('<div id="' + sortupid + '" class="Sortup">▲</div>');
        $(sortcontsel).append('<div id="' + sortdownid + '" class="Sortdown">▼</div>');
        TableObject.SortUpListeners(sortupid);
        TableObject.SortDownListeners(sortdownid);
    };
    //add rows to table, one for each company in directory
    for (e=0;e<CompanyDirectory.length;e++){
        var nextcompsymbol = CompanyDirectory[e];
        var nextrowid = 'row_' + nextcompsymbol;
        $('#TableBody').append('<tr id="' + nextrowid + '"></tr>');
    };
    //add cells to each company row, add cell for each item in DisplayedFields array
    for (f=0;f<CompanyDirectory.length;f++){
        var nextcompsymbol = CompanyDirectory[f];
        var rowid = 'row_' + nextcompsymbol;
        var rowsel = '#row_' + nextcompsymbol;
        var ctrlid = 'ctrlcont_' + nextcompsymbol;
        var hideid = 'hide_' + nextcompsymbol;
        var ctrlsel = '#' + ctrlid;
        var hidesel = '#' + hideid;
        $(rowsel).append('<td id="'+ ctrlid + '" class="ctrlcell"></td>');
        $(ctrlsel).append('<div id="'+ hideid + '" class="hidediv">Ⓧ</div>');
        TableObject.HideRowListeners(rowid);
        for (g=0;g<DisplayedFields.length;g++){
            var compobj = window[nextcompsymbol];
            var nextfield = DisplayedFields[g];
            var statitem = compobj[nextfield];
            var nextcellid = nextcompsymbol + '_' + nextfield;
            $(rowsel).append('<td id="' + nextcellid + '" class="datacell">' + statitem + '</td>');
        };
    };
};       

//method to add/handle click events on the #sortup div buttons
TableObject.SortUpListeners = function(element){
    element = document.getElementById(element);
    element.onclick = function(){
        var targetid = this.id;
        var targetpar = $(this).parent();
        var targetparid = $(targetpar).attr('id');
        var statstr = targetparid.replace('sortcont_','');
        var stat = window['Stat'];
        stat.SortStatArray(statstr,'up');
        stat.ImposeOrder(statstr);
        TableObject.BuildTable();
    };
};


//method to add/handle click events on the #sortdown div buttons
TableObject.SortDownListeners = function(element){
    element = document.getElementById(element);
    element.onclick = function(){
        var targetpar = $(this).parent();
        var targetparid = $(targetpar).attr('id');
        var statstr = targetparid.replace('sortcont_','');
        var stat = window['Stat'];
        stat.SortStatArray(statstr,'down');
        stat.ImposeOrder(statstr);
        TableObject.BuildTable();
    };
};

TableObject.HideRowListeners = function(element){
    element = document.getElementById(element);
    elementsel = '#' + element;
    element.onclick = function(){
        $(element).hide();
        var index = CompanyDirectory.indexOf(element);
        CompanyDirectory.splice(index,1);
    };
};

TableObject.AddFieldListeners = function(element){
    //var element = 'check_' + element;
    element = document.getElementById(element);
    element.className = 'FieldDiv';
    elementsel = '#' + element;
    element.onclick = function(){
        var targetid = this.id;
        var status = this.checked;
        var field = targetid.toString();
        console.log(status);
        //if-else statement to prevent addition of already added field
        if (status === true){
            if($.inArray(field,DisplayedFields) > -1){
                alert('That field has already been added');
            }
            else {
                DisplayedFields.push(field);
                element.className = 'FieldDivSelected';
            };
        }
        else {
            var index = DisplayedFields.indexOf(field);
            if (index > -1){
                DisplayedFields.splice(index,1);
            }
        }
        
    };   
};
///////////////////////////////////Stat.UpdateStatArrays(compobj);

//////////////////////////   
//COMPANY OBJECT METHODS//
//////////////////////////


//add method to company prototype to retrieve data for a company
Company.prototype.GetData = function(symbol){
    var compobj = window[symbol];
    var requestpre = "https://query.yahooapis.com/v1/public/yql?q=";
    var requestpost = "&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
    for (r=0;r<yqltablekey.length;r++){
        var table = yqltablekey[r];
        var yqlpre = encodeURIComponent(yqlpreObj[table]);
        var yqlpost = encodeURIComponent(yqlpostObj[table]);
        var request =requestpre + yqlpre + symbol + yqlpost + requestpost;
        Object.defineProperty(compobj,table,{writable:true,enumerable:true,configurable:true});
        $.ajax({
            type: 'GET',
            url: request,
            datatype: 'jsonp',
            //upon success updates the fields of the company instance from the retreived JSON
            success: function(data){
                var results = data.query.results;
                var key = Object.keys(results);
                compobj[key] = results;
            },
            error: function(jqXHR,textStatus,errorThrown){
                CompanyDirectory.pop();
                alert('Object: ' + jqXHR +  'Error Type: '+ textStatus + 'HTTP Status: ' + errorThrown);
                alert('Request Error.  Check to make sure you entered correct stock symbol (or your network connection) and try again.');
            }
        });
    };
};



//////////////////
//GENERALMETHODS//
//////////////////

//method to add a new compnay
//need to check if company already exists
//function AddCompany(){
//    var item = $('#symbols').val();
//    var splitindex = item.search(' - ');
//    var symbol = item.substring(0,splitindex);
//    console.log(symbol);
//    if ($.inArray(symbol,CompanyDirectory) > -1) {
//        alert('That company has already been added.');
//    }
//    else {
//        if (symbol) {
//            CompanyDirectory.push(symbol);
//            window[symbol] = new Company;
//            var newestobj = window[symbol];
//            newestobj.GetData(symbol);
//        }
//        else {
//            alert ("Please Enter a Company Symbol");
//        };
//    };
//    $('#AddCompanyInput').val('');
//};




/////////////////
//OTHER METHODS//
/////////////////




/////////////////////////////////////////////
//ITEMS TO SAVE IN CASE YOU WANT THEM LATER//
/////////////////////////////////////////////
