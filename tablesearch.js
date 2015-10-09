/*
Copyright (c) 2015 Cirons @ Philip Andersson
*/

function TableSearch(table, pageSize) {

    this.table = table;
    this.tbody = this.table.getElementsByTagName("TBODY")[0];
    this.tableArray = [];
    this.shownIndexes = null;
    this.pageCount = 0;
    this.itemCount = 0;
    this.elementArray = [];
    this.columnCount = [];
    this.shownItemCount = 0;
    this.paginatedItems = [];
    this.page = 1;
    this.pagination = null;

    if (!pageSize) {
        //if page size is not set, do default (10 items)
        pageSize = 10;
    }
    this.pageSize = pageSize;

    this.init();
}

TableSearch.prototype = {

    init: function() {
    	this.wrapTable();
        this.getColumnCount();
        this.serializeTable();
        this.renderPagination();
        this.renderSearchBox();
        this.render();
    },

    getColumnCount: function() {
        var thead = this.table.getElementsByTagName("THEAD")[0];
        this.columnCount = thead.getElementsByTagName("TH").length;
    },

    serializeTable: function() {

        var array = [];

        var trs = this.tbody.getElementsByTagName("TR");
        for (var i = 0; i < trs.length; i++) {

            this.itemCount++;

            var tr = trs[i];

            this.elementArray.push(tr);

            var row = [];

            var tds = tr.getElementsByTagName("TD");
            for (var ii = 0; ii < tds.length; ii++) {
                var td = tds[ii];
                var text = td.textContent;

                if (text.trim() !== "") {
                    row.push(td.textContent);
                }
            }

            array.push(row);
        }
        this.emptyTable();
        this.tableArray = array;
    },

    renderSearchBox: function(){
    	var input = document.createElement("input");
    	input.autocomplete = "off";
    	input.placeholder = "Search...";
    	var self = this;
    	input.onkeyup = function(){
    		self.search(this.value);
    	};

    	this.insertBefore(this.table, input);
    },

    noSearchResult: function() {
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.colSpan = this.columnCount;
        td.innerHTML = "No results matching your search criteria... :(";

        tr.appendChild(td);
        this.tbody.appendChild(tr);
    },

    search: function(keyword) {
        this.page = 1;
        if (keyword.trim() == "") {
        	this.shownIndexes = null;
        	this.render();
            return;
        }

        var indexes = [];

        for(var i = 0; i < this.itemCount; i++){
        	var item = this.tableArray[i];

        	for(var ii = 0; ii < item.length; ii++){
        		var col = item[ii];
        		var re = new RegExp(keyword, "gi");
        		var match = col.toString().match(re);
        		if(match && match.length){
        			indexes.push(i);
        		}
        	}
        }
        console.log(indexes);
        if(!indexes.length){
        	this.emptyTable();
        	this.noSearchResult();
        	return;
        }

        this.shownIndexes = indexes;
        this.shownItemCount = indexes.length;
        this.render();
    },

    render: function() {

        var items = [];

        if (this.shownIndexes == null) {
            //show all
            items = this.elementArray;
        } else {
            for (var i = 0; i < this.shownItemCount; i++) {
                var index = this.shownIndexes[i];
                var item = this.elementArray[index];
                items.push(item);
            }
        }

        this.sliceToPages(items);

        items = this.getPage(this.page);
        this.appendElements(items);

        this.reloadPagination();
    },

    appendElements: function(elements) {
        this.emptyTable();
        for (var i = 0; i < elements.length; i++) {
            this.tbody.appendChild(elements[i]);
        }
    },

    emptyTable: function() {
        this.tbody.innerHTML = "";
    },

    sliceToPages: function(elements) {
        var array = [];
        var pageSize = this.pageSize;

        for (var i = 0; i < elements.length; i += pageSize) {
            array.push(elements.slice(i, i + pageSize));
        }
        this.pageCount = array.length;
        this.paginatedItems = array;
    },

    getPage: function(page) {
        return this.paginatedItems[page - 1];
    },

    insertAfter: function(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    },

    insertBefore: function(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    },

    renderPagination: function(){
    	var pagination = document.createElement("div");
    	pagination.innerHTML = "test";
    	pagination.className += "ts-pagination";
    	this.insertAfter(this.table, pagination);
    	this.pagination = pagination;
    },

    showPage: function(page){
    	this.page = page;
    	var items = this.getPage(this.page);
    	console.log(this);
        this.appendElements(items);
    },

    reloadPagination: function(){
    	this.pagination.innerHTML = "";
    	var ul = document.createElement("ul");
    	for(var i = 1; i <= this.pageCount; i++){
    		var li = document.createElement("li");
    		var a = document.createElement("a");
    		a.href = "javascript:;";
    		a.innerHTML = i.toString();

    		if(i == this.page){
    			a.className += "ts-page-active";
    		}

    		var self = this;
    		a.onclick = function(){
    			self.showPage(parseInt(this.innerHTML));
    		};

    		li.appendChild(a);
    		ul.appendChild(li);
    	}
    	this.pagination.appendChild(ul);
    },

    wrapTable: function () {
    	var toWrap = this.table;
	    var wrapper = document.createElement('div');
	    wrapper.className += "ts-table";
	    if (toWrap.nextSibling) {
	        toWrap.parentNode.insertBefore(wrapper, toWrap.nextSibling);
	    } else {
	        toWrap.parentNode.appendChild(wrapper);
	    }
	    return wrapper.appendChild(toWrap);
	}

};