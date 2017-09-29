"use strict";

Talks.npcs = {
    "charles": {
        "default": {
            "male": [
                "Olá meu amigo!",
                "Me chamo Charles, secretário da chancelaria do Imperador local. Além disso sou o embaixador oficial dos clérigos nestas terras.",
                "Você pode descansar e vender suas coisas aqui.",
                "Aqui se econtram muitas pessoas diferentes e por conta disso sou responsável por representar as autoridades cabiveis.",
                "Então, vamos conversar:"
            ],
            "female": [
                "Olá mocinha!",
                "Me chamo Charles, secretário da chancelaria do Imperial local. Além disso sou o embaixador oficial dos clérigos nestas terras.",
                "Você pode descansar e vender suas coisas aqui.",
                "Aqui se econtram muitas pessoas diferentes e por conta disso sou responsável por representar as autoridades cabiveis.",
                "Então, vamos conversar:"
            ]
        },
        "empire": {
            "male": [
                "É bom vê-lo novamente!",
                "Vejo que tem sido leal ao Imperador mesmo em épocas como esta. Não perca sua fé e não caia na conversa dos confederados... Mantenha-se firme, amigo! Deus seja minha testemunha de como lhe ajudarei. Sou Charles, seu servo.",
            ],
            "female": [
                "É bom vê-la novamente!",
                "Estou feliz que você não tenha se afastado das leis imperiais. Eu esperava que você ficasse conosco, a cidade carece de garotas sinceras e de menta aberta que não estão fascinadas com as promessas dos confederados. Eu o diretor local da chancelaria Imperial, sou seu leal servo. Pergunte-me e eu ajudarei."
            ]
        },
        "confederation": {
            "male": [
                "Ei amigo.",
                "Então, como é que vai? Eu espero que pelo menos eles tenham te alimentaram bem. Mas desculpa a minha grosseria. Somos todos iguais aqui, então eu não devo preferir aqueles que se mantêm fiéis ao nosso senhor. Mesmo se eu sendo o CEO da Chancelaria do Imperador, eu tenho que manter um olho sobre esta cidade. Então, eu vou ajudar você com toda a minha bondade.",
            ],
            "female": [
                "Jovem senhorita!",
                "O que à traz até mim? Sinto muito por você ter de se juntar a esses vagabundos, mas não se preocupe, a nossa relação não vai mudar. Você com certeza tinha alguns motivos para fazer isso, e eu não posso julgar. Somos todos iguais aqui, mas... eu esperava que você fosse escolher uma mais... forma suave. De qualquer maneira, Charles é seu servo.",
            ]
        },
        "actions": {
            "Set citizenship": "Quero entrar para uma facção.",
            "Get claim": "Quero reivindicar minhas terras.",
            // "Get village claim": "Eu gostaria de me estabelecer aqui na cidade (10 de Platina).",
        },
    },
    "diego": {
        "default": {
            "male": [
                "Ei! O nome é Diego, eu sou embaixador daqui! Embora eu prefira uma boa luta, melhor do que toda essa políticagem. Então, se você quiser caçar eu posso mostrar a você lugares interessates! Ha-ha!"
            ],
        },
        "actions": {
            "Show instances": "Mostre-me lugares para caçar.",
        }
    },
    "scrooge": {
        "default": {
            "male": [
                "Bem-vindo!",
                "Estamos sempre felizes em ver novos clientes. Venha, sente-se. Meu nome é Scrooge eu gerêncio o maior banco de Rogalia.",
                "Nosso banco é tão grande que podemos dar ao luxo de abrir filiais em aldeias remotas como esta. Não se preocupe, a qualidade do nosso serviço será sempre o mesma.",
                "Eu posso guardar o seu dinheiro. É triste dizer você não está nem ai para isso, mas posso manter seu dinheiro seguro.",
                "E mais, para os proprietários nós podemos oferecer um fundo de poupança. Se você tiver alguma receita, todos os seus rendimentos serão salvos automaticamente na sua conta. Um bom lucro e sem cobranças adicionais.",
                "Então, o que deseja?"
            ]
        },
        "actions": {
            "Bank": "Banco.",
            "Exchange": "Mercado de câmbio.",
        },
    },
    "sabrina": {
        "default": {
            "male": [
                "Espera! Não se aproxime de nós... Ah... Tudo bem... Ah, dane-se. Desculpa, menu nome é Sabrina, eu sou a alquimista local. Eu tenho tudo: a partir de uma folha de bananeira para poções de banana, que dão vida a uma pedra! Haha, brincadeirinha."
            ],
            "female": [
                "Espera! Não se aproxime de nós... Ah... Tudo bem... Ah, dane-se. Desculpa, menu nome é Sabrina, eu sou a alquimista local. Eu tenho tudo: de uma folha de bananeira para os espíritos da banana, que você irá atrair maridos da forma que desejar! Haha, brincadeirinha."
            ]
        },
        "actions": {
            "Trade": "Quero ver seus produtos.",
        },
    },
    "larisa": {
        "default": {
            "male": [
                "Bem vindo à casa de leilões de Rogalia! Claro, nós somos apenas do ramo de leilões do Império Dome, mas hey, o bens aqui são bem váriados! Eu sou Larisa, me diga se você quer participar do leilão."
            ]
        },
        "actions": {
            "Auction": "Quero ver os leilões.",
            "Get vendor license": "Quero uma licença para leiloar."
        },
    },
    "shot": {
        "default": {
            "male": [
                "Ei, bonitão, me chamo Shot, sente-se.",
                "O nosso pub \"Coiote Dançante\" é o único lugar nesta cidade que merece atenção. Não importa o que o pilantra do Charles disser. Temos comida, água e algo quente na sala ao lado. Mas um homem como você lidar com isso.",
            ],
            "female": [
                "Olá, amiga",
                "Me chamo Shot, aqui no pub \"Coiote Dançante\". Temos comida, água e mais uma coisa na sala ao lado, mas para você talvez não seja interessante. Nossa cidade é muito boa, embora existam alguns caipiras e vagabundos por aqui. Eu acho que seremos boas amigas!",
            ]
        },
        "empire": {
            "male": [
                "Que tipo de refeição este nobre cavalheiro deseja hoje?",
                "Temos sementes de batata que você pode plantar. Água de primeira classe não do rio, do lago, muito menos da lagoa. Ei, não faça essa cara. É apenas um pub local, não o majestoso restaurante no centro da capital Imperial. O que você esperava de um pub chamado \"Coiote dançante\" você esperava ver algo a mais? Meu nome é Shot, ao seu dispor.",
            ],
            "female": [
                "Oh! A Lady Imperial chega para o jantar!",
                "Bem, espero atender suas expectativas. Tenho sementes de todos os tipos. O que? Uma comida casual? Você acha que estas sementes não valem nada?! E água somente da chuva?! Brincadeira. Para beber água aqui apenas pagando. Regras são regras. Você pode escrever uma reclamação, sim. Depois das minhas palavras: \"O proprietário do pub Shot, da confederação e orgulhosa filha de confederados, não mostra nenhum respeito com as mulheres Imperiais\"."
            ]
        },
        "confederation": {
            "male": [
                "Ei, bonitão, me chamo Shot, sente-se.",
                "O nosso pub \"Coiote Dançante\" é o único lugar nesta cidade que merece atenção. Não importa o que o pilantra do Charles disser. Temos comida, água e algo quente na sala ao lado. Mas um homem como você lidar com isso.",
            ],
            "female": [
                "Olá, amiga",
                "Me chamo Shot, aqui no pub \"Coiote Dançante\". Temos comida, água e mais uma coisa na sala ao lado, mas para você talvez não seja interessante. Nossa cidade é muito boa, embora existam alguns caipiras e vagabundos por aqui. Eu acho que seremos boas amigas!",
            ]
        },
        "actions": {
            "Trade": "Quero ver seus produtos.",
            "Drink water": "Quero molhar a garganta (5 silver)",
        }
    },
    "margo": {
        "default": {
            "male": [
                "Ei, querido, não fuja!",
                "Venha, vamos nos divertir, você sabe quem eu sou, não é? Eu sei os nomes que as pessoas gostam de me chamar, mas eu prefiro \"Vôo Noturno\", porque eu pareço uma borboleta, certo? Asas de seda, corpo iluminado, beleza majestosa, e eu trago um prazer para as pessoas, veja, o tipo especial de prazer. Então, você está aqui só para olhar?",
            ],
            "female": [
                "Hey querida porta errada?",
                "Venha, não se acanhe. Eu li tudo em seus olhos, não diga mais nada. Eu sou Margo, e eu sou o que você precisa. Confie em mim, eu posso ver sua tensão, você veio ao lugar certo. Nós vamos lutar contra isso. Uma mulher deve deixar-se, mostrar-se ao mundo, e deixar seus preconceitos de distância. Venha, querida. Sentar-se. Eu não vou morder.",
            ]
        },
        "empire": {
            "male": [
                "Querido, venha, não seja tímido.",
                "Bem, se você está aqui, acho que já sabe que eu sou Margo e meu serviço é muito especial. Sente-se, desanse ... Você precisa descansar, não precisa? Eu sei que você, um Imperial leal, não gostam de pessoas como eu, mas relaxa e goza..."
            ],
            "female": [
                "Sim? Posso ajuda-la?",
                "Margo, está sou eu. A prostituta se você preferir. Alguma dúvida? Eu vejo que você está curiosa. Qualquer Imperial iria me desejar. Mas.. Oh! Eu posso ver a paixão em seus olhos? Oh meu Deus, é uma paixão. Perdoe-me pela grosseria. Este luga é instavel as vezes, você sabe. Ignore as coisas que Charles disser, o Império e a Confederação sempre serão inimigos, até mesmo em uma ilha deserta. Mas não se preocupe, Sou leal ao meus clientes. É melhor aliviar seu estresse comigo do que com esses pescoçudos vermelhos."
            ]
        },
        "confederation": {
            "male": [
                "Querido, venha, não seja tímido.",
                "Uau, me apaixonei! Eu sinto o homem que há em você, sua postura faz minhas pernas tremerem! Eu acho que você veio por um motivo, certo? Vocês nos deixam as moscas por todo o Império. Então você sabe o que fazer, certo? Pode me chamar de Margo ou do que quiser, deite e desanse...",
            ],
            "female": [
                "Entre bebê, Margo sempre fica feliz em ver lindas garotas como você.",
                "Neste luga cheio de brutos, gordos e sujos toda garota precisa descansar e se divertir as vezes, precisa liberar a tenão, certo? Profissionais como eu dão as pessoas o que elas merecem, e você quer ficar comigo, certo? Sente-se, deixe mamãe Margo cuidar de você...",
            ]
        },
        "actions": {
            "Buy sex": "Comprar sexo (10 gold)",
        }
    },
    "bruno": {
        "default": {
            "male": [
                "Bem vindo a minha humilde loja.",
                "Me chamo Bruno, ficarei feliz em ajuda-lo a escolher a roupa certa ou tecido. Sou o melhor alfaiate do Império.",
            ],
            "female": [
                "Amor, não me ignore, de uma olhada!",
                "Meu nome é Bruno, está é minha loja. Você pode comprar roupas ou tecidos de todos os gostos. Escolha algo.",
            ]
        },
        "empire": {
            "male": [
                "Olá, cavalheiro!",
                "Sou o Bruno o alfaiate local. Se precisar de roupas, estou aqui para você. Feliz em servir um Imperial.",
            ],
            "female": [
                "Amor, venha ver o que eu tenho!",
                "É sempre bom ver um rosto amigavel. Sou Bruno, e se precisar de roupas melhores, você pode adiquirir por um preço bacana."
            ]
        },
        "confederation": {
            "male": [
                "Hey, bonito!",
                "Mesmo que esteja servindo a Confederação, não podemos deixar você sem roupas... Me chamo Bruno, venha, lhe trarei as melhores roupas de Rogalia!",
            ],
            "female": [
                "Hey, gata!",
                "Mesmo que esteja servindo a Confederação, não podemos deixar você sem roupas... Me chamo Bruno, o melhor alfaiate que já existiu!",
            ]
        },
        "actions": {
            "Trade": "Quero ver seus produtos.",
        },
    },
    "ahper": {
        "default": {
            "male": [
                "Havia um tempo em que eu poderia quebrar uma perna em um instante... Opss. Perdoe-me.",
            ]
        },
        "actions": {
            "Trade": "Quero ver seus produtos.",
        },
    },
    "cosmas": {
        "default": {
            "male": [
                "Oi. Está é minha forja. você precisa de alguma arma ou armadura? Xiiu... Todos querem meus pregos ou aros.",
            ]
        },
        "actions": {
            "Trade": "Quero ver seus produtos.",
            "Repair": "I want to repair my stuff",
        },
    },
    "boris": {
        "default": {
            "male": [
                "Entre, filho, nossa igreja sempre recebe novos membros.",
                "Meu nome é Boris, sou o abade desta abadia, aqui, nestas terras, eu trago a luz para todos que precisam dela. Você está aqui para absolvição, correto?",
            ],
            "female": [
                "Entre, filha, nossa igreja sempre recebe novos membros.",
                "Meu nome é Boris, sou o abade desta abadia, aqui, nestas terras, eu trago a luz para todos que precisam dela. Você está aqui para absolvição, correto?",
            ]
        },
        "empire": {
            "male": [
                "Entre, filho, nossa igreja sempre recebe novos membros.",
                "Meu nome é Boris, sou o abade desta abadia, aqui, nestas terras, eu trago a luz para todos que precisam dela. Você está aqui para absolvição, correto?",
            ],
            "female": [
                "Entre, filha, nossa igreja sempre recebe novos membros.",
                "Meu nome é Boris, sou o abade desta abadia, aqui, nestas terras, eu trago a luz para todos que precisam dela. Você está aqui para absolvição, correto?",
            ]
        },
        "confederation": {
            "male": [
                "Entre, filho, nossa igreja sempre recebe novos membros.",
                "Meu nome é Boris, sou o abade desta abadia, aqui, nestas terras, eu trago a luz para todos que precisam dela. Você está aqui para absolvição, correto?",
            ],
            "female": [
                "Entre, filha, nossa igreja sempre recebe novos membros.",
                "Meu nome é Boris, sou o abade desta abadia, aqui, nestas terras, eu trago a luz para todos que precisam dela. Você está aqui para absolvição, correto?",
            ]
        },
        "actions": {
            "Trade": "Quero comprar minha absolvição",
        }
    },
    "bertran": {
        "default": {
            "male": [
                "Caaaarne...",
                "Não se esqueça majestoso cavalheiro, venha visitar Bertram. Eu sou o açougueiro local e eu sou bom em corte de carcaças. Posso cortar qualquer carcaça, não sua carcaça, não tenha medo. Eu não gosto mais de cortar carne viva. Você pode comprar carne para cozinhar.",
            ],
            "female": [
                "Que tal uma saborosa carne...",
                "Quero dizer, que tal um saboroso filé que tenho aqui. Eu AMO o filé. É um prazer para cortá-lo... Perdoe-me, senhorita. Eu viajei. Eu sou Bertram, o açougueiro local. Você pode comprar carne aqui, eu poderia ensiná-la a cozinhar, ou... deixa pra lá, eu sei que você não precisa.",
            ]
        },
        "actions": {
            "Trade": "Quero ver os seus bens.",
        }

    },
    "vendor": {
        "default": {
            "male": [
                "Bem-vindo a minha modesta loja, cavalheiro.",
            ],
            "female": [
                "Bem-vindo a minha modesta loja, senhorita.",
            ],
        },
        "actions": {
            "Trade": "Quero ver os seus bens.",
        },
    },
    "ded-moroz": {
        "default": {
            "male": [
              "Oi, eu sou Papai Noel, já houviu falar?",
              "Caso alguém pergunte: alguém estranho que não ve ninguém que não acredita em magica... Eu estava em casa, na ilha de Inverno, tentando preparar todos os presentes, inclusive o seu. Não esperava te dizer... Bem, vamos continuar.",
              "Logo será um novo ano! E no Ano Novo todos os sonhos e se tornam um presente. Você, por sinal, é menino ou menina? Você quer um presente? ... Aguarde ANTES DE ANO NOVO!",
              "Ho-ho-ho! Bem, bem. Posso antecipar seu presente, mas primeiro, eu preciso de uma pequena ajuda.",
              "A propósito, minha neta, a donzela da neve, também têm alguns recados para você.",
              "Fale com ela, boa menina mas um pouco estranha. Pobre coitada um armário com seus livros de poemas infantis caiu.",
            ],
        },
    },
    "snegurochka": {
        "default": {
          "male": [
              "Quem está falando? Cantando?",  // solicitar descrição
              "E para quem estão fugindo multidão e gritar disputando",
              "Cem monstros, duzentos e um mago assassino nu?",
              "Vamos lá, não seja menino com medo, - Estou satisfeito hoje para todos",
              "Eu tenho presentes - como você não pode comprar aqui.",
              "Desde o mágico Val Hala trazido a você por eixos",
              "E as espadas e paus de diferentes poções ressaca e vermelho,",
              "Bolo de aniversário",
              "E as mulheres de borracha.",
              "Há apenas um problema -",
              "Eu não posso encontrar um substituto em qualquer lugar.",
              "E eu preciso de um homem, mas corajoso",
              "Para entram na épica madeiras",
              "E voltou ileso",
              "Sabe-los? Então",
              "Enviá-los todos aqui",
              "As pessoas estão morrendo muito rápido",
              "Nestas terras - aqui e ali.",
              "Não nos ajudar - trouble",
              "Não passe sempre.",
              "Um maravilhoso Ano Novo",
              "Basta passar sem nós!",
              "Bem, o que você disse?",
              "Não ficar em silêncio - e os dentes não bater.",
              "Eu sou - uma natureza fria.",
              "Porque eu reduzir a temperatura aqui em torno de mim,",
          ].join("<br>"),
          "female": [
              "O que é isto que está fazendo a terra toda tremer?",
              "Para a dieta não é seguido e marcas deixadas por aqui!", // solicitar descrição
              "Vamos lá, não se preocupe querida. Eu não vou matar",
              "Snow Maiden irá temperar todas as tortas de hoje.",
              "Chocolates, bolos, grama",
              "Acabei tudo.",
              "O suficiente por enquanto",
              "Esqueça que a vida - não muito", // solicitar descrição
              "Isso é o que eu sempre falo,",
              "Ajude-me, em seguida,",
              "Tia Sneruka facilmente", // solicitar descrição
              "Você está discursos dotados",  // solicitar descrição
              "E coisas úteis.",
              "Não nos ajudar - trouble",
              "Não passe sempre.",
              "Um maravilhoso Ano Novo",
              "Basta passar sem nós!",
              "Bem, o que você disse?",
              "Não seja silencioso e os dentes não bater.",
              "Eu sou - uma natureza fria.",
              "Porque eu reduzir a temperatura aqui em torno de mim,",
            ].join("<br>"),
        },
    },
    "ivan": {
        "default": {
            "male": [
                "Olá! Aproximam-se, não seja tímido!",
                "Eu sou Ivan, o lenhador local. Você procura por um bom serrote, machado ou outras ferramentas para lenhador? Peça, vamos escolher algumas coisas!",
            ],
        },
    },
    "plato": {
        "default": {
            "male": [
                "Tenha um bom dia, amigo.",
                "Eu sou Plato, e o meu trabalho é ensinar novatos o básico de sobrevivência. Não importa se você está aqui por vontade ou obrigado pelo Imperador como um castigo. Ouça e preste atenção, para que não sejá o jantar dos animais selvagens.",
            ],
        },
    },
    "athena": {
        "default": {
            "male": [
                "A-ha! Arena de carne fresca!",
                "Meu nome é Athena, eu sou a gerente da arena de luta. Eu não me importo se você é homem ou mulher, que idade você está, qual é a facção que você prefere. Eu só quero ver á sede de sangue em seus olhos! Você pode contestar a sua força com pessoas na arena."
            ]
        },
    },
    "alfred": {
        "default": {
            "male": [
                "Bem-vindo ao hotel, estranho.",
                "Eu sou Alfred, o mordomo. Se você estiver precisando de um ambiente caloroso e acolhedor, você vai encontrá-lo aqui. Isso não é um espaço para a rainha, mas ele irá fornecer-lhe um bom descanso.",
            ],
        },
    },
    "angelina": {
        "default": {
            "male": [
                "Boooooooo!",
                "Não tem medo também? Porra... eu sou fantasma Angela. Eu digo contos e histórias arrepiantes. Sente-se, eu vou contar uma.",
            ],
        },
    },
};
