import data from './Namirnice.js'




let zene_mrsavljenje =  [{

      

            zajutrak: [

                data.kruh.data
                
            ],

            dorucak: [

                data.mlijecni_proizvodi.data
            ],

            rucak: [

                data.meso.data,
                data.povrce.data
            ],

            uzina: [

                data.voce.data
            ],

            vecera: [

                data.mlijecni_proizvodi.data,
                data.povrce.data
                
            ]
        
    }]

 let zene_fitnes =  [{

      

            zajutrak: [

                data.povrce.data
                
            ],

            dorucak: [

                data.mlijecni_proizvodi.data,
                data.povrce.data
            ],

            rucak: [

                data.meso.data,
                data.povrce.data,
                data.voce.data
            ],

            uzina: [

                data.voce.data
            ],

            vecera: [

                data.meso.data,
                data.povrce.data
                
            ]

    }]
    

let zene_trudnice =[{

    zajutrak: [

        data.voce.data
        
    ],

    dorucak: [

        data.mlijecni_proizvodi.data,
        data.voce.data
    ],

    rucak: [

        data.meso.data,
        data.povrce.data,
        data.voce.data
    ],

    uzina: [

        data.voce.data
    ],

    vecera: [

        data.meso.data,
        data.povrce.data
        
    ]



}]

let muski_mrsavljenje = {

    zajutrak: [

        data.kruh.data
        
    ],

    dorucak: [

        data.mlijecni_proizvodi.data
    ],

    rucak: [

        data.meso.data,
        data.povrce.data
    ],

    uzina: [

        data.voce.data
    ],

    vecera: [

        data.mlijecni_proizvodi.data,
        data.povrce.data
        
    ]


}

let muski_teretana = {

    zajutrak: [

        data.kruh.data,
        data.mlijecni_proizvodi.data
        
    ],

    dorucak: [

        data.mlijecni_proizvodi.data,
        data.meso.data
    ],

    rucak: [

        data.meso.data,
        data.povrce.data
    ],

    uzina: [

        data.voce.data
    ],

    vecera: [

        data.mlijecni_proizvodi.data,
        data.povrce.data,
        data.voce.data
        
    ]


}

export default {zene_mrsavljenje, zene_fitnes, zene_trudnice, muski_mrsavljenje, muski_teretana}