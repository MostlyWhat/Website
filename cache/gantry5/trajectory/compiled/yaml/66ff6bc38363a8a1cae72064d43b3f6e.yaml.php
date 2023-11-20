<?php
return [
    '@class' => 'Gantry\\Component\\File\\CompiledYamlFile',
    'filename' => 'D:/MAMP/htdocs/grav/user/plugins/gantry5/engines/nucleus/particles/branding.yaml',
    'modified' => 1698650920,
    'data' => [
        'name' => 'Branding',
        'description' => 'Displays powered by link to Gantry Framework',
        'type' => 'particle',
        'icon' => 'fa-trademark',
        'configuration' => [
            'caching' => [
                'type' => 'static'
            ]
        ],
        'form' => [
            'fields' => [
                'enabled' => [
                    'type' => 'input.checkbox',
                    'label' => 'Enabled',
                    'description' => 'Globally enable to the particles.',
                    'default' => true
                ],
                'content' => [
                    'type' => 'textarea.textarea',
                    'label' => 'Content',
                    'description' => 'Create or modify custom branding content.',
                    'default' => 'Powered by <a href="http://www.gantry.org/" title="Gantry Framework" class="g-powered-by">Gantry Framework</a>'
                ],
                'css.class' => [
                    'type' => 'input.selectize',
                    'label' => 'CSS Classes',
                    'description' => 'CSS class name for the particle.',
                    'default' => 'branding'
                ]
            ]
        ]
    ]
];
