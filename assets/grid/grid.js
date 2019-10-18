var pre = api;
var url = {
  get: `${pre}/assets`,
}
var grid

$(document).ready(function() {
  get();

  $('#asset-search').on('keyup', (e) => {
    const search = $('#asset-search').val().toLowerCase();
    const assets = $('.grid > div').toArray();

    if (search === '') {
      assets.forEach((asset) => $(asset).show().fadeIn())
    } else {
      //console.log($('.grid > div').toArray());
      assets.forEach((asset, i) => {
        if(!$(asset).attr('name').toLowerCase().includes(search)){
          $(asset).hide();
          //console.log($(asset).attr('name'))
        } else {
          $(asset).show();
        }
      })
    }
  });
})

function addGridItem(asset, i) {
  const gridItem = $(`<div class="col s12 m6 l4 asset-box" name=${asset.assetAlias}>
            <div class="card asset-card">
              <div class="card-image">
      					<img id='asset-image' src="/assets/grid/view/splash.png" alt="Asset Image" >
              </div>
              <div class="card-content card-bottom asset-card-bottom">
                <p>${asset.assetAlias}</p>
                <a class="btn btn-small waves-effect waves-light moreInfo-btn" href="assets/grid/view/?assetId=${asset.assetId}">More Info</a>
              </div>
            </div>
  				</div>`);

    $('.grid').append(gridItem);
}

function get() {
  $.ajax({
		type: "GET",
		url: url.get,
		dataType: 'json'
  })
	.done(data => {
    console.log(data);
		data.forEach(function(asset, i) {
      addGridItem(asset, i);
	  });
    //grid = new Muuri('.grid');
  })
}
