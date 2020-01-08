document.addEventListener("DOMContentLoaded", function() {
    /**
     * То что в корзине
     *[
     *  {"id":"2","name":"Product 2","img":"yellow-clipart-christmas-1.png","price":"231","qrt":2},
     *  {"id":"4","name":"Product 4","img":"blue-clipart-christmas-1.png","price":"332","qrt":1},
     *  {"id":"3","name":"Product 3","img":"red-clipart-christmas-1.png","price":"432","qrt":1}
     * ]
     */


    /**
     * глобальные переменные
     */
    let  cart_modal = "", cartBody = "", list_products = "", products = "";

    /**
     * Отсюда запускаем все функции для посмотра и управления корзиной
     */
    function showCart() {
        //если корзина не пуста то можно ее показать
        if(testCart()) {  //проверяем куки и если они есть заполняем корзину

            cart_modal = document.querySelector('#modal-shop-cart');
            cartBody = document.getElementById('cart-body');
            list_products = document.getElementById('list-products');

            getCart();   // заполняем модалку перебранным массивом из корзины

            openCart();  // показывем корзину

            plusMinusProduct(); // функция для увеличение/уменьшения количества товара

            removeItem(); // функция для удаления ненужного товара

        }else{
            return false;
        }

        /**
         * Закрываем корзину при нажатии кнопки Закрыть или Х
         * у всех элементов закрывающих корзину класс сlose-сart
         */
        cart_modal.addEventListener('click', function (event) {
            let target = event.target;
            if(target && target.classList.contains('close-cart')) {
                closeCart();
            }
        });

    }

    /**
     * Функия для закрытия корзины,
     * Принимает в качестве парраметра время до закрытия в милисекундах
     * У блока удаляем класс "show" и свойство "display = none"
     * Если добавлена затемняющяя заливка то
     * body.removeChild(document.getElementsByClassName('modal-backdrop')[0]);
     * @param time
     */
    function closeCart() {
        //$('#modal-shop-cart').modal('hide');
        cart_modal.style.display = 'none';
        cart_modal.classList.remove('show');

        // удаляем затемнение
        if(document.getElementsByClassName('modal-backdrop')[0]){
            removeModalBackdrop();
        }
        $('#list-products').html("");
    }

    /**
     * Открываем модалку через JS
     * К блоку добавляем класс "show" и свойство "display = block"
     * Затемняющим фоном не заливаю
     * Для заливки в котец BODY надо добавить блок с заливкой
     * <div class="modal-backdrop fade show"></div>
     * можно открыть через JQuery, но мы легких путей не ищем
     */
    function openCart() {
        cart_modal.style.display = 'block';
        cart_modal.classList.add('show');
        //добавляем затемнение
        createModalBackdrop();
    }

    /**
     * Создание блока затемняющего весь экрвн под модалкой
     */
    function createModalBackdrop() {
        let div = document.createElement('div');
        div.classList.add('modal-backdrop','fade','show');
        document.body.appendChild(div);
    }

    /**
     * Удаление блока затемняющего весь экрвн под модалкой
     */
    function removeModalBackdrop() {
        document.body.classList.remove('modal-open');
        document.body.removeChild(document.getElementsByClassName('modal-backdrop')[0]);
    }

    /**
     * Выборка из куки корзины
     * Заполняем в файле cart.php шаблон строками
     * Обязательно подключение underscore-min.js
     */
    function getCart() {

        let templateProductItem = document.getElementById('product-template').innerHTML,
            compiled = _.template(templateProductItem),
            html = '',
            list_products = document.getElementById('list-products'),
            summ_price = 0;

        list_products.innerHTML = "";
        products.forEach(function(product) {
            let data = {
                id: product.id,
                name: product.name,
                img: product.img,
                price: product.price,
                qrt: product.qrt
            };
            summ_price += +product.qrt * +product.price;
            html += compiled(data);
        });
        $('#list-products').append(html);
        document.getElementById('itog').textContent = summ_price;
    }

    /**
     * Удаление из корзины,
     * 1) Вешаем слушателя и все тело modal-body id="cart-body"
     * 2) ловим нажатие по красному кресту с классом "btn-del_product-to-catr"
     * 3) получаем из атрибута "data-id", айди товара
     * 4) Отыскиваем его в куках корзины и удаляем
     * 5) удаляем всю строчку
     * 6)
     */
    function removeItem() {
        cartBody.addEventListener('click', function (e) {
            let target = e.target;
            if(target && target.classList.contains('btn-del_product-to-cart')){
                e.preventDefault();
                //получаем айди продукта
                let id = target.getAttribute('data-id');
                removRow(id); //
                itog(); //пересчет общий суммы
            }
        });
    }

    /**
     * механизм удаления строчки с экрана и из кук
     * получает id удаляемого товаа
     */
    function removRow(id) {
        let remove_item = '';
        products.forEach(function (product, key) {
            if(product.id === id){
                //запоминаем ключ удаляемого элемента
                remove_item = key;
            }
        });

        if(remove_item === "") return false;
        //удаляем ненужный элемент из масива продуктов
        products.splice(remove_item,1);

        if(products.length < 1){
            document.cookie = 'cart=; path=/; expires=-1';
        }
        //закидываем масив в куки

        document.cookie = 'cart='+JSON.stringify(products); // обновляем куку с корзиной
        // удаляем строчку из визуального отображения
        let rem_row = document.getElementById("row-"+id);
        rem_row.parentNode.removeChild(rem_row);
    }

    /**
     * Увеличение количства товара на 1 ед.
     */
    function plusProduct(id) {
        products.forEach(function (item) {
            if(item['id'] === id){
                item['qrt'] ++; //увеличиваем количество на 1
            }
        });
        document.cookie = 'cart='+JSON.stringify(products); // обновляем куку с корзиной
    }

    /**
     * Уменьшение количства товара на 1 ед.
     */
    function minusProduct(id) {
        products.forEach(function (item) {
            if(item['id'] === id){
                item['qrt'] --; //увеличиваем количество на 1
            }
        });
        document.cookie = 'cart='+JSON.stringify(products); // обновляем куку с корзиной
    }

    /**
     * плюс минус единица товара
     * Увеличения/уменьшение количества товара в корзине
     *
     */
    function plusMinusProduct() {
        // отслеживание куда нажади
        // если минус то ищим следующий элемент и увеличиваем его на 1
        // если плюс то предыдущий элемент ищем
        // запись в куки

        document.querySelectorAll('.btn-number').forEach(function (item) {
            item.addEventListener('click', function () {
                let target = this;
                subPlusMinus(target); // добавляем или удаляем одну единицу товара
            });
        });
    }

    /**
     * чтобы не плодить анонимные функции при навешивание слушателя на кнопки
     */
    function subPlusMinus(target) {
        let qrt = 0, qrt_html = '',
            id = target.getAttribute('data-id');

        switch (target.getAttribute('data-type')){
            case "minus":
                qrt_html = document.getElementById('qrt-'+id);
                qrt = +qrt_html.textContent;
                qrt --;
                if(qrt > 0){
                    qrt_html.textContent = qrt;
                    minusProduct(id);
                }else{
                    //если ноль то удалить строчку
                    removRow(id);
                }
                itog(); // суммируем корзину
                break;
            case "plus":
                qrt_html = document.getElementById('qrt-'+id);
                qrt = +qrt_html.textContent;
                qrt ++;
                if(qrt > 0){
                    qrt_html.textContent = qrt;
                    plusProduct(id);
                }
                itog(); // суммируем корзину
                break;
        }
    }

    /**
     * Проверка есть ли чего нибуть в куках корзины,
     * если есть заполняем глобальную переменную  products
     */
    function testCart() {

        let arr_cookie = document.cookie.split(";"); // куки в массив через разделитель
        let cart = "";

        // удалим пробельные символы (если они, вдруг, есть) в начале и в конце у каждой куки
        for (let j=0; j<arr_cookie.length; j++) {
            arr_cookie[j] = arr_cookie[j].replace(/(\s*)\B(\s*)/g, '');
        }

        //  ищем куку с корзиной
        arr_cookie.forEach(function (val, key) {
            if(val.match(/cart=(.+?)/)){
                // преобразуем строчку в масив через разделител "="
                //отделяем имя куки в нулевой элемент массива , а значение куки в первый элемент
                cart = arr_cookie[key].split('=');
            }
        });
        if(cart.length > 0){
            products = JSON.parse(cart[1]); //парсим  JSON в массив
            return true;
        }
        return false;
    }

    /**
     * Зачистка модалки при скрытии ее ( убрать уже внесенные данные)
     */
    function clearModal() {
        //list_products = "";
        //cart_modal = "";
        //cartBody = "";
        //products = "";
        $('#list-products').html("");
    }

    /**
     *  Суммируем общий итог в корзине
     */
    function itog() {
        let itog = 0;
        products.forEach(function (item) {
            itog += +item['price'] * item['qrt'];
        });
        document.getElementById("itog").textContent = itog;
    }


    /**
     * кнопка для вызова корзины
     * Можно прицепить к любому элементу
     * его оригинальный вызов отключается
     */

    let btn_sh_cart = document.getElementById('shopping-cart');

    if(testCart()) {
        btn_sh_cart.style.color = "red";
    }

    if(btn_sh_cart){
        btn_sh_cart.addEventListener('click', function (e) {
            e.preventDefault();
            showCart();
        });
   }

});
