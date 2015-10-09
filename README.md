# Cirons.com tablesearch.js
Turn HTML-table into a searchable and paginated thru JS.

# Getting started

Start with a HTML-table:
```
<table id="table">
	<thead>
		<tr>
			<th>First Name</th>
			<th>Last Name</th>
			<th>Company Name</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Philip</td>
			<td>Andersson</td>
			<td>Cirons.com</td>
		</tr>
		<tr>
			<td>Jonas</td>
			<td>Jonasson</td>
			<td>Cirons.com</td>
		</tr>
		<tr>
			<td>John</td>
			<td>Doe</td>
			<td>Cirons.com</td>
		</tr>
	</tbody>
</table>
```

```
<script type="text/javascript" src="tablesearch.js"></script>
<script type="text/javascript">
	var table = document.getElementById("table");
	//TableSearch(JS-element, (optional) pageSize)
	var ts = new TableSearch(table);
</script>
```

Good luck

/ Cirons.com