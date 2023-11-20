<?php
return [
    '@class' => 'Gantry\\Component\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/themes/trajectory/blueprints/styles/font.yaml',
    'modified' => 1699021468,
    'data' => [
        'name' => 'Font Families',
        'description' => 'Font families for the Trajectory theme',
        'type' => 'core',
        'form' => [
            'fields' => [
                'family-default' => [
                    'type' => 'input.fonts',
                    'label' => 'Body Font',
                    'default' => 'Metropolis, DM Sans, Arial, sans-serif'
                ],
                'family-title' => [
                    'type' => 'input.fonts',
                    'label' => 'Title Font',
                    'default' => 'Metropolis, DM Sans, Arial, sans-serif'
                ],
                'family-mono' => [
                    'type' => 'input.fonts',
                    'label' => 'Monospace Font',
                    'default' => 'DM Mono, Arial, sans-serif'
                ]
            ]
        ]
    ]
];
