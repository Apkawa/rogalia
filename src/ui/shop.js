/* global _, dom, game, TS, Panel, T, util, Barbershop, TT */

"use strict";

function Shop() {
    var self = this;
    const currency = ({Cost, Discount, Tag}, discount = false) => {
        const cost = (discount)
              ? Cost * (100 - Discount)/100
              : Cost;
        const bucks = Tag == "lemons";
        return dom.wrap("shop-currency", [
            (bucks) ? "$" : dom.img(`assets/icons/lemon.png`, "shop-currency-icon"),
            util.toFixed(cost, 2)
        ]);
    };

    this.tabs = null;

    var buyButton = null;

    var loaded = false;
    var onload = function(){};

    this.panel = new Panel("shop", "Shop", [], {
        show: function() {
            if (loaded) {
                onload();
            } else {
                load(function() {
                    loaded = true;
                    onload();
                });
            }
        },
    }).setTemporary(true);

    this.sync = function(data) {
        const input = dom.tag("input");
        input.value = data.Url;
        input.readonly = true;
        new Panel("steam-payment", "Steam", [
            dom.wrap("urlbar", [
                input,
                dom.button(T("Open"), "", () => window.open(data.Url, "_blank")),
            ]),
            dom.hr(),
            T("For security reasons, Steam may ask you to enter your login and password."),
            dom.hr(),
            dom.iframe(data.Url),
        ]).show();
    };

    let lemons = undefined;
    this.update = function() {
        if (game.player.Lemons !== lemons) {
            lemons = game.player.Lemons;
            this.setLemons(lemons);
       }
    };

    let lemonsIcon = null;
    this.setLemons = function(lemons) {
        if (!lemonsIcon) {
            lemonsIcon = dom.wrap("#lemons-icon");
            this.panel.button.appendChild(lemonsIcon);
        }
        lemonsIcon.textContent = lemons;
    };

    this.search = function(pattern) {
        onload = function() {
            search(pattern);
            onload = function(){};
        };
        this.panel.show();
    };

    var cards = [];

    function load(onload) {
        game.network.send("shop-list", {}, function(data) {
            var tabs = [
                {
                    title: T("Character"),
                },
                {
                    title: T("Mounts"),
                },
                {
                    title: T("Walls"),
                },
                {
                    title: T("Items"),
                },
                {
                    title: "",
                    init: (title, contents) => {
                        title.id = "lemons-tab";
                        dom.append(title, dom.img("assets/icons/lemon.png"));
                    }
                },
            ];

            var groups = _.map(_.groupBy(data.Products, ".Group"), function(products) {
                return _.orderBy(products, ".Tag");
            });

            _.forEach(groups, function(group, index) {
                var tag = "";
                var contents = [];
                _.forEach(group, function(product) {
                    if (tag != product.Tag) {
                        tag = product.Tag;
                        contents.push(dom.wrap("product-tag", TS(tag)));
                    }
                    var card = dom.wrap("product-card product-card-" + tag, [
                        product.Discount && dom.wrap("product-discount", `-${product.Discount}%`),
                        dom.wrap("product-info", [
                            productName(product),
                            dom.wrap("product-cost", [
                                product.Discount && dom.wrap("product-original-cost", currency(product)),
                                currency(product, true)
                            ]),
                        ]),
                    ]);
                    card.name = product.Name;
                    card.tab = tabs[index];
                    card.style.backgroundImage = "url(assets/shop/" + product.Name + "/preview.png)";
                    card.onclick = () => { openCard(product); };
                    cards.push(card);
                    contents.push(card);
                });
                tabs[index].contents = dom.scrollable("products", contents);
            });
            self.tabs = dom.tabs(tabs);
            self.panel.setContents(self.tabs);
            onload();
        });
    }

    function sendOrder(product, callback) {
        game.network.send("shop", {
            Product: product.Name,
            Data: product.data,
            Order: product.order,
        }, callback);
    }

    function openCard(product) {
        buyButton = dom.button(T("Buy"), "product-buy", () => {
            if (product.Tag == "lemons") {
                sendOrder(product); // , (data) => pay(product, data.Order)
                return;
            }
            game.popup.confirm(
                [
                    `${T("Spend")} ${product.Cost}`,
                    dom.img(`assets/icons/lemon.png`),
                    "?",
                ],
                () => sendOrder(product)
            );
        });
        const help = dom.link("#", Shop.descriptions["how-to"], "product-help");
        help.onclick = function(event) {
            new Panel("shop-help", "Shop", dom.iframe(`shop/${game.lang}.html`)).show();
            event.preventDefault();
            return false;
        };
        const desc = Shop.descriptions[product.Tag];
        self.panel.setContents([
            dom.wrap("product-name", productName(product)),
            dom.hr(),
            dom.wrap("product-cost big", [
                product.Discount && dom.wrap("product-original-cost", currency(product)),
                currency(product, true)
            ]),
            dom.wrap("product-buy-container", [
                buyButton,
                product.Discount && dom.wrap("product-discount", `-${product.Discount}%`),
            ]),
            (product.Tag == "hairstyle" && hairstylePreview(product)),
            dom.wrap("product-images", _.range(1, 4).map(function(index) {
                return dom.img(`assets/shop/${product.Name}/${index}.png`);
            })),
            dom.wrap("product-desc", desc),
            (product.Tag == "wall" && recipeLink(product)),
            help,
            (product.Name == "title" && titleEditor(product)),
            dom.button(T("Back"), "back", back),
        ]);
    }

    function productName(product) {
        return TS(hairstyleName(product.Name));
    }

    function hairstyleName(name) {
        return name.replace(/-(fe)?male/, "");
    }

    function pay(product, order) {
        const paymentType = param("paymentType", "AC");

        let selectedOption = "steam";
        const options = [
            dom.img("assets/shop/payment-steam.png", "selected", {
                title: "Steam",
                onclick() {
                    selectedOption = "steam";
                }
            }),
            dom.img("assets/shop/payment-card.png", "", {
                title: "Yandex Card",
                onclick() {
                    selectedOption = "yandex-card";
                    paymentType.value = "AC";
                }
            }),
            dom.img("assets/shop/payment-yandex.png", "", {
                title: "Yandex",
                onclick() {
                    selectedOption = "yandex";
                    paymentType.value = "PC";
                },
            }),
        ];
        options.forEach(option => {
            option.classList.add("payment-option");
            option.addEventListener("click", () => {
                options.forEach(option => option.classList.remove("selected"));
                option.classList.add("selected");
            });
        });

        var name = productName(product);
        var form = dom.make("form", [
            param("receiver", "41001149015128"),
            param("formcomment", name),
            param("short-dest", name),
            param("quickpay-form", "shop"),
            param("targets", product.Name),
            param("sum", product.Cost),
            param("label", order),
            paymentType,
        ], "#payment-form");
        form.action = "https://money.yandex.ru/quickpay/confirm.xml";
        form.method = "POST";
        form.target = "_blank";
        dom.hide(form);

        var iframe = dom.tag("iframe", "#payment-form");
        iframe.name = "payment-iframe";
        dom.hide(iframe);

        const panel = new Panel("payment", T("Payment"), [
            T("Select payment method"),
            dom.wrap("methods", options),
            dom.button(T("Pay"), "", (event) => {
                switch (selectedOption) {
                case "steam":
                    // sendOrder({...product, order});
                    break;
                default:
                    form.submit();
                }
                // firefox won't sumbit form if no button available
                // so we have to defer panel destruction
                _.defer(() => panel.close());
            }),
            form,
            iframe,
        ]).show();
    }

    function param(name, value) {
        var input = dom.tag("input");
        input.name = name;
        input.value = value;
        input.type = "hidden";
        return input;
    }

    function back() {
        self.panel.setContents(self.tabs);
    }

    function search(pattern) {
        pattern = pattern.replace("-plan", "");
        var card = _.find(cards, function(card) {
            return card.name.match(pattern);
        });

        if (!card)
            return;

        card.tab.tab.title.click();
        card.onclick();
    }

    function hairstylePreview(product) {
        var color = dom.div("hairstyle-color");
        buyButton.disabled = true;
        return dom.wrap("hairstyle-preview", [
            dom.button(T("Try on"), "", function() {
                var name = hairstyleName(product.Name).replace("-hair", "");
                new Barbershop(name, function(hairstyle) {
                    buyButton.disabled = false;
                    product.data = hairstyle;
                    var style = hairstyle.split("#");
                    color.style.backgroundColor = "#" + style[1];
                    color.style.opacity = style[2];
                });
            }),
            color,
        ]);
    }

    function titleEditor(product) {
        var maxLength = 10;
        var prefix = dom.tag("input");
        prefix.setAttribute("maxlength", maxLength);
        var suffix = dom.tag("input");
        suffix.setAttribute("maxlength", maxLength);
        var result = dom.span(game.playerName);
        result.readonly = true;
        buyButton.disabled = true;
        return dom.wrap("title-preview", [
            prefix,
            game.playerName,
            suffix,
            dom.button(T("Ok"), "", function() {
                buyButton.disabled = false;
                result.textContent = (prefix.value + " " + game.playerName + " " + suffix.value).trim();
                product.data = (prefix.value + " {name} " + suffix.value).trim();
            }),
            dom.wrap("title-preview-result", [
                T("Title") + ": ",
                result,
            ])
        ]);
    }

    function recipeLink(product) {
        return dom.button(T("Recipe"), "product-recipe", function() {
            game.controller.craft.panel.show();
            game.controller.craft.search(TS(product.Name.replace(/-wall$/, "")), true);
        });
    }
}
