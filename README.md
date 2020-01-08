# view_shopping_cart
##JS. View shopping cart

Отображение корзины товаров на JS.

##Функции которые выполняет корзина:
   1. Отображать информацию о товаре (картинка, название, количество, цена).
   2. Удаление строки товара.
   3. Добавить или Удалить единицу товара.
   4. общий итог по корзине.

В файле cart.html шаблон модалки 

Строки с товаром заполняются через JS шаблонизатор underscore используя _.template().
Обязательно подключить библиотеку underscore.min.js
Сами скроки беруться из переменной в куки, корзина представляет из себя массив:
```js
    /**
     * То что в корзине
     *[
     *  {"id":"2","name":"Product 2","img":"yellow-clipart-christmas-1.png","price":"231","qrt":2},
     *  {"id":"4","name":"Product 4","img":"blue-clipart-christmas-1.png","price":"332","qrt":1},
     *  {"id":"3","name":"Product 3","img":"red-clipart-christmas-1.png","price":"432","qrt":1}
     * ]
     */
```
>Формируется  это массив в этом скрипте https://github.com/AndreyTSpb/js_add_to_cart

В функции getCart перебирается масиив продуктов и заполняется шаблон.
```js
let templateProductItem = document.getElementById('product-template').innerHTML, // получаем шаблон для заполнения по его айди
            compiled = _.template(templateProductItem),
            html = '',
            list_products = document.getElementById('list-products'); // место куда помещать сформированый шаблон

        list_products.innerHTML = ""; // зачишаем если чтонибуть там есть
        products.forEach(function(product) {
            //перебираем массив и формируем новый объект для заполнения плейсхолдеров
            let data = {
                id: product.id,
                name: product.name,
                img: product.img,
                price: product.price,
                qrt: product.qrt
            };
            html += compiled(data); 
        });
        $('#list-products').append(html); // помещаем в модалку
```

В шаблонизаторе используется плейсхолдер такого типа: 
   <%= id %> - это место для переменной id, 
   <%= name %> - название товара,
   <%= img %>  - изображение,
   <%= qrt %>  - количество едениц,
   <%= price %> - цена за единицу
   
   

```html
<!-- HTML template for products -->
<script id="product-template" type="text/template">
    <li class="list-group-item" id="row-<%= id %>">
        <div class="row">
            <div class="col-2 text-center">
                <img src="images/<%= img %>" width="35px" height="35px">
            </div>
            <div class="col-3">
                <%= name %>
            </div>
            <div class="col-3 text-center">
                <span class="input-group-btn">
                      <button type="button" class="btn btn-default btn-number btn-sm pl-0 pr-0"  data-type="minus" data-id = "<%= id %>" data-field="quant[2]">
                        <i class="fa fa-minus"></i>
                      </button>
                </span>
                <span class="qrt" id="qrt-<%= id %>"><%= qrt %></span>
                <span class="input-group-btn">
                      <button type="button" class="btn btn-default btn-number btn-sm pl-0 pr-0" data-type="plus" data-id = "<%= id %>" data-field="quant[2]">
                          <span class="fa fa-plus"></span>
                      </button>
                </span>
            </div>
            <div class="col-2 text-right">
                <%= price %>
            </div>
            <div class="col-2 text-center text-danger h4">
                <i class="fa fa-times btn-del_product-to-cart cursor-pointer " data-id="<%= id %>" aria-hidden="true"></i>
            </div>
        </div>
    </li>
</script>
```
