const ACCESS_TOKEN =
	'a5928e816edc7addfa4298669bd534f83b8cd907b920511b7d2f86f0d5b3e270';
const SPACE_ID = '2q1fpqwpgegt';

const contentfulClient = contentful.createClient({
	accessToken: ACCESS_TOKEN,
	space: SPACE_ID
});

const PRODUCT_CONTENT_TYPE_ID = '2PqfXUJwE8qSYKuM0U6w8M';

let renderOneCategory = (container, categoryIndex) => {

		const renderProducts = products =>
			`<div class="products row">
			  ${products.map(renderSingleProduct).join('\n')}
			</div>`;

		const renderSingleProduct = (item ,id)=> {
			return `<div class="col-md-4 col-sm-6">
			<div class="product-in-list card mb-4 box-shadow">
			<div class="product-image card-img-top">
			  ${renderImage(item.images)}
			</div>
			<div class="product-details card-body">
			  ${renderProductDetails(item,id)}
			</div>
			</div>
			</div>`;
		};

		const renderProductDetails = (item,id) =>
			`${renderProductHeader(item)}
			<p class="product-categories">
				${item.stars}
			</p>
			<p><button type="button" class="btn btn-light"><a href="${window.location}&product=${id}">BROWSE</a></button></p>`;

		const renderProductHeader = item =>
			`<div class="product-header">
			  <h2>
				${item.title}
			  </h2>
		 </div>`;

		const renderImage = image =>
			`<div class="image" style="background:url(${image})">
	  </div>`;
	

	fetch("data.json").then((data) => {
		data.text().then((dataText) => {
			// console.log(dataText);
			result = JSON.parse(dataText);
			container.innerHTML = renderProducts(result[categoryIndex].items);
		})
	})

}


let renderCategories = (container) => {

	const renderProducts = products =>
		`<div class="products row">
		  ${products.map(renderSingleProduct).join('\n')}
		</div>`;

	const renderSingleProduct = (categories, index) => {
		return `<div class="col-md-4 col-sm-6">
		<div class="product-in-list card mb-4 box-shadow">
		<div class="product-image card-img-top">
		  ${renderImage(categories.images)}
		</div>
		<div class="product-details card-body">
		  ${renderProductDetails(categories, index)}
		</div>
		</div>
		</div>`;
	};

	const renderProductDetails = (category, id) =>
		`${renderProductHeader(category)}
		<p><button type="button" class="btn btn-light"><a href="${window.location}?category=${id}">FIND</a></button></p>`


	const renderProductHeader = categories =>
		`<div class="product-header">
		  <h2>
			${categories.names}
		  </h2>
	 </div>`;

	const renderImage = image =>
		`<div class="image" style="background:url(${image})">
  </div>`;


fetch("categories.json").then((data) => {
	data.text().then((dataText) => {
		// console.log(dataText);
		result = JSON.parse(dataText);
		container.innerHTML = renderProducts(result[0].Products);
	})
})

}

let renderLinks = (container, categoryIndex, productIndex) => {

	const renderProducts = links =>
		`<div class="products row">
		  ${links.map(renderSingleProduct).join('\n')}
		</div>`;

	const renderSingleProduct = link => {
		return `<div class="col-md-4 col-sm-6">
		<div class="product-in-list card mb-4 box-shadow">
		<div class="product-image card-img-top">
		  ${renderLink(link)}
		  
		  
		</div>
		</div>
		</div>`;
	};

	const extractYoutubeId = link => {
		return link.replace("watch?v=", "embed/");
	}
	const renderLink = link =>
  	`<iframe src="${extractYoutubeId(link)}" width="350" height="315" 
	  		frameborder="0"></iframe>`;


fetch("data.json").then((data) => {
	data.text().then((dataText) => {
		result = JSON.parse(dataText);
		container.innerHTML = renderProducts(result[categoryIndex].items[productIndex].links);
	})
})

}

document.addEventListener('DOMContentLoaded', event => {
	const container = document.getElementById('content');
	var url = new URL(window.location);
	var categoryIndex = url.searchParams.get("category");
	if(categoryIndex != undefined)
	{
		var productIndex = url.searchParams.get("product");
		if(productIndex != undefined)
			renderLinks(container, parseInt(categoryIndex), parseInt(productIndex));
		else
			renderOneCategory(container, parseInt(categoryIndex));
	}
	else
	{
		renderCategories(container);
	} 	
});

