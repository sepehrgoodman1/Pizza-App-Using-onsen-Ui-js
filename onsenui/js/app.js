//Refreshing page
ons.ready(function () {
    var pullHook = document.getElementById('pull-hook');

    pullHook.addEventListener('changestate', function (event) {
        var message = '';

        switch (event.state) {
            case 'initial':
                message = 'Pull to refresh';
                break;
            case 'preaction':
                message = 'Release';
                break;
            case 'action':
                message = 'Loading...';
                break;
        }

        pullHook.innerHTML = message;
    });

    pullHook.onAction = function (done) {
        setTimeout(done, 1000);
    };
});
//Refreshing page

//carousel (Edited By Myself)
var prev = function () {
    var carousel = document.getElementById('carousel');
    carousel.prev();
};

var carousel_counter = 0;

var next = function () {
    var carousel = document.getElementById('carousel');
    const count_carousel = document.querySelectorAll(".count-carousel");

    carousel_counter++;
    if (carousel_counter >= count_carousel.length) {
        for (var i = 1; i <= count_carousel.length - 1; i++) {
            setTimeout(function () {
                prev();
            }, 500);
        }
        carousel_counter = 0;
    }
    carousel.next();
};
ons.ready(function () {
    var carousel = document.addEventListener('postchange', function (event) {
        // console.log('Changed to ' + event.activeIndex);
    });
});
$(document).ready(function () {
    setInterval(function () {
        next();
    }, 2000);
});
//carousel

//Hide Dialog  (Edited By Myself)
var hideDialog = function (id) {
    document.getElementById(id).hide();
    var total = document.querySelector(".total");
    var price = parseFloat(total.innerHTML.replace('Total : $', ''));
    total.innerText = 'Total :$0';
    var ShopList = document.querySelector(".All-list-cart");
    while (ShopList.hasChildNodes()) {
        ShopList.removeChild(ShopList.firstChild);
    }
    var shopHomeList = document.querySelector(".All-list-home-page");
    var addtoCartList = shopHomeList.querySelectorAll(".add-to-cart");
    for (var i = 0; i < addtoCartList.length; i++) {
        if (addtoCartList[i].classList.contains("addedToCart")) {
            addtoCartList[i].classList.remove("addedToCart");
            addtoCartList[i].parentElement.querySelector(".add-to-cart").innerText = "Add To Cart";
        }
    }
    var badgeCart = document.querySelector("#badge-cart");
    badgeCart.setAttribute("badge", "");
    ordersPage(price);
    var discontTxt = document.querySelector(".discount");
    discontTxt.innerHTML = "Discount : $0";

};
//Hide Dialog

//Order page (Adding A list of Orders)
function ordersPage(price) {
    var orderList = document.querySelector("#list-orders-page");
    var badge_order = document.querySelector("#badge-order");
    var Badge = orderList.querySelectorAll(".price-orders");
    var txt = `<ons-list-item modifier="longdivider" tappable>
        <div class="left">${Badge.length}</div>
        <div class="center price-orders">$${price}</div>
        <div class="right status-order">In-Process</div>
    </ons-list-item>`
    badge_order.setAttribute("badge", Badge.length);
    orderList.innerHTML += txt;
}
//Order page

//List-Cart Process (Adding Food And Their Information To Cart Page And Calculate Total Price And ...)
window.onload = function () {
    var addToCart = document.querySelectorAll(".add-to-cart");
    $(addToCart).on("click", function () {
        this.classList.add("addedToCart");
        this.innerText = "Added!";
        var parentEl = this.parentElement;
        var name = parentEl.querySelector(".food-name").innerText;
        var price = parentEl.querySelector(".food-price").innerText;
        var srcImg = parentEl.querySelector("img").src;
        AddToCartList(name, price, srcImg);
    });

    function AddToCartList(name, price, srcImg) {
        var shoplist = document.querySelector(".All-list-cart");
        var items = shoplist.querySelectorAll(".food-title-cart");
        for (var i = 0; i < items.length; i++) {
            if (name == items[i].innerHTML) {
                return;
            }
        }
        var txtList = `<ons-list-item>
        <div class="inside-list-cart">
          <div class="left img-cart">
            <img
              src="${srcImg}"
              class="img-responsive med-curve"
              alt=""
            />
          </div>
          <div class="food-title-cart">${name}</div>
          <div class="price-item-cart fl-left" cost="${price.replace("$","")}">${price}</div>

          <div class="Box-plus-food-cart">
            <div class="plus-food-cart fl-right">
              <ons-icon
                size="25px"
                icon="fa-plus-circle"
                style="color: #bb0000"
              ></ons-icon>
            </div>
            <div class="count-food-cart center">
              <input class="input-cart" type="number" value="1" />
            </div>
            <div class="minus-food-cart fl-left">
              <ons-icon size="25px" icon="fa-minus-circle"></ons-icon>
            </div>
          </div>
          <div class="remove-cart fl-right">
            <ons-icon icon="fa-times"></ons-icon>
          </div>
        </div>
      </ons-list-item>`
        $(".All-list-cart").append(txtList);
        updateFor();
        calculateItemPrice();
        updateBadge();
    }
    $(document).on("click", ".remove-cart", function () {
        var parentEl = this.parentElement.parentElement;
        var nameFood = parentEl.querySelector(".food-title-cart");
        var list_home = document.querySelector(".All-list-home-page");
        var All_name = list_home.querySelectorAll(".food-name");
        for (var i = 0; i < All_name.length; i++) {
            if (nameFood.innerHTML == All_name[i].innerHTML) {
                var parentEL = All_name[i].parentElement;
                parentEL.querySelector(".add-to-cart").classList.remove("addedToCart");
                parentEL.querySelector(".add-to-cart").innerText = "Add To Cart";
            }
        }
        parentEl.remove();
        calculateItemPrice();
        updateBadge();
    });
    $(document).on("click", ".plus-food-cart", function () {
        var selectedList = this.parentElement.parentElement;
        var plusIcon = selectedList.querySelector(".count-food-cart .input-cart");
        plusIcon.value++;

        calculateItemPrice();
    });
    $(document).on("click", ".minus-food-cart", function () {
        var selectedList = this.parentElement.parentElement;
        var minusIcon = selectedList.querySelector(".count-food-cart .input-cart");
        if (isNaN(minusIcon.value) || minusIcon.value <= 1) {
            minusIcon.value = 1;
        } else {
            minusIcon.value--;
        }
        calculateItemPrice();
    });
    updateFor();

    function updateFor() {
        var inputs = $(".All-list-cart .count-food-cart .input-cart");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].addEventListener("change", function () {
                if (isNaN(this.value) || this.value < 1) {
                    this.value = 1;
                }
                calculateItemPrice();
            })
        }
    }

    function calculateItemPrice() {
        var itemPrice = document.querySelectorAll(".All-list-cart .price-item-cart");
        var itemNum = document.querySelectorAll(".All-list-cart .input-cart");
        var totalPrice = 0;
        for (var i = 0; i < itemNum.length; i++) {
            var price = parseFloat(itemPrice[i].getAttribute("cost"));
            price *= itemNum[i].value;
            itemPrice[i].innerText = "$" + (Math.floor(price*100)/100);
            totalPrice += price;
        }
        totalPrice = Discount(totalPrice);
        var total = document.querySelector(".total");
        total.innerText = 'Total : $';
        total.innerHTML +=(Math.round(totalPrice*100)/100) ;
    }

    function updateBadge() {
        var shoplist = document.querySelector(".All-list-cart");
        var list = shoplist.querySelectorAll(".inside-list-cart");
        var badgeCart = document.querySelector("#badge-cart");
        if (list.length > 0) {
            badgeCart.setAttribute("badge", list.length);
        } else {
            badgeCart.setAttribute("badge", '');
        }

    }
    $(".continue-shopping").on("click", function () {
        if (parseFloat(document.querySelector(".total").innerHTML.replace('Total : $', '')) > 0) {
            showTemplateDialog();
        }
    });
    //List-Cart Process

    //Calculate Discount
    function Discount(total_price) {
        var discontTxt = document.querySelector(".discount");
        var discount = 1 / 10;
        if (total_price > 15.00) {
            var disC = total_price * discount;
            var disCPrice = total_price - disC;
            discontTxt.innerHTML = "Discount : $";
            discontTxt.innerHTML += (Math.round(disC*100)/100);
            
            return disCPrice;
        } else{
            discontTxt.innerHTML = "Discount : $0";
            return total_price;
        } 
    }
    //Calculate Discount




    //Show Dialog
    var showTemplateDialog = function () {
        var dialog = document.getElementById('my-dialog');

        if (dialog) {
            dialog.show();
        } else {
            ons.createElement('dialog.html', {
                    append: true
                })
                .then(function (dialog) {
                    dialog.show();
                });
        }
    };
    $(".closeDialog").on("click", function () {
        hideDialog('my-dialog');
    });
    //show dialog

};