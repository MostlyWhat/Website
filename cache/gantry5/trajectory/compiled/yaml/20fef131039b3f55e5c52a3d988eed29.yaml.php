<?php
return [
    '@class' => 'Gantry\\Component\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/plugins/gantry5/engines/nucleus/blueprints/page/body.yaml',
    'modified' => 1698650920,
    'data' => [
        'name' => 'Body Attributes',
        'description' => 'Settings that can be applied to the page.',
        'type' => 'global',
        'form' => [
            'fields' => [
                'attribs.id' => [
                    'type' => 'input.text',
                    'label' => 'Body Id',
                    'default' => NULL
                ],
                'attribs.class' => [
                    'type' => 'input.selectize',
                    'label' => 'Body Classes',
                    'default' => 'gantry'
                ],
                'attribs.extra' => [
                    'type' => 'collection.keyvalue',
                    'label' => 'Tag Attributes',
                    'description' => 'Extra Tag attributes.',
                    'key_placeholder' => 'Key (data-*, style, ...)',
                    'value_placeholder' => 'Value',
                    'exclude' => [
                        0 => 'id',
                        1 => 'class'
                    ]
                ],
                'layout.sections' => [
                    'type' => 'select.selectize',
                    'label' => 'Sections Layout',
                    'description' => 'Default layout container behavior for Sections',
                    'default' => 0,
                    'options' => [
                        0 => 'Fullwidth (Boxed Content)',
                        2 => 'Fullwidth (Flushed Content)',
                        1 => 'Boxed',
                        3 => 'Remove Container'
                    ]
                ],
                'body_top' => [
                    'type' => 'textarea.textarea',
                    'label' => 'After <body>',
                    'description' => 'Anything in this field will be appended right after the opening body tag'
                ],
                'body_bottom' => [
                    'type' => 'textarea.textarea',
                    'label' => 'Before </body>',
                    'description' => 'Anything in this field will be appended right before the closing body tag'
                ]
            ]
        ]
    ]
];
