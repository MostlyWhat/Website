<?php
return [
    '@class' => 'Gantry\\Component\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/themes/trajectory/blueprints/styles/testimonials.yaml',
    'modified' => 1698848956,
    'data' => [
        'name' => 'Testimonials Styles',
        'description' => 'Testimonials section styles for the Trajectory theme',
        'type' => 'section',
        'form' => [
            'fields' => [
                'background' => [
                    'type' => 'input.colorpicker',
                    'label' => 'Background',
                    'default' => '#8f4dae'
                ],
                'background-image' => [
                    'type' => 'input.imagepicker',
                    'label' => 'Background Image',
                    'default' => 'gantry-media://testimonials/img01.jpg'
                ],
                'background-overlay' => [
                    'type' => 'select.select',
                    'label' => 'Background Overlay',
                    'description' => 'Enables the linear gradient overlay made of accent colors.',
                    'placeholder' => 'Select...',
                    'default' => 'enabled',
                    'options' => [
                        'enabled' => 'Enabled',
                        'disabled' => 'Disabled'
                    ]
                ],
                'text-color' => [
                    'type' => 'input.colorpicker',
                    'label' => 'Text',
                    'default' => '#eceeef'
                ]
            ]
        ]
    ]
];
