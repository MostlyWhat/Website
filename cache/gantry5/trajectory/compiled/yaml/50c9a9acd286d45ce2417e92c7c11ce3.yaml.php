<?php
return [
    '@class' => 'Gantry\\Component\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/plugins/gantry5/engines/nucleus/particles/langswitcher.yaml',
    'modified' => 1698650920,
    'data' => [
        'name' => 'Language Switcher',
        'description' => 'Language Switcher Particle for Grav LangSwitcher Plugin',
        'type' => 'particle',
        'icon' => 'fa-globe',
        'dependencies' => [
            'platform' => [
                'grav' => [
                    'plugin' => [
                        'langswitcher' => true
                    ]
                ]
            ]
        ],
        'form' => [
            'fields' => [
                'enabled' => [
                    'type' => 'checkbox',
                    'label' => 'Enabled',
                    'description' => 'Globally enable Language Switcher particles.',
                    'default' => true
                ]
            ]
        ]
    ]
];
