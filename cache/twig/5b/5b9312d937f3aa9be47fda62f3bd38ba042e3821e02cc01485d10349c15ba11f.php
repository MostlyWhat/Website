<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* @nucleus/page_head.html.twig */
class __TwigTemplate_6a7d49073ac533e46d97f35cb2a2b4cd1e92b9186074e34f235a43f7c204011a extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
            'head_stylesheets' => [$this, 'block_head_stylesheets'],
            'head_scripts' => [$this, 'block_head_scripts'],
            'head_platform' => [$this, 'block_head_platform'],
            'head_overrides' => [$this, 'block_head_overrides'],
            'head_meta' => [$this, 'block_head_meta'],
            'head_title' => [$this, 'block_head_title'],
            'head_application' => [$this, 'block_head_application'],
            'head_ie_stylesheets' => [$this, 'block_head_ie_stylesheets'],
            'head' => [$this, 'block_head'],
            'head_custom' => [$this, 'block_head_custom'],
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "debugger", []), "assets", [], "method");
        // line 2
        $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", []), "loadAtoms", [], "method");
        // line 4
        $context["faEnabled"] = (($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "enable", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "enable", []), 1)) : (1));
        // line 5
        $context["faVersion"] = ((($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "version", [], "any", true, true) &&  !(null === $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "version", [])))) ? ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "version", [])) : (((($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "default_version", [], "any", true, true) &&  !(null === $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "default_version", [])))) ? ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "default_version", [])) : ("fa4"))));
        // line 6
        $assetFunction = $this->env->getFunction('parse_assets')->getCallable();
        $assetVariables = ["priority" => 10];
        if ($assetVariables && !is_array($assetVariables)) {
            throw new UnexpectedValueException('{% scripts with x %}: x is not an array');
        }
        $location = "head";
        if ($location && !is_string($location)) {
            throw new UnexpectedValueException('{% scripts in x %}: x is not a string');
        }
        $priority = isset($assetVariables['priority']) ? $assetVariables['priority'] : 0;
        ob_start();
        // line 7
        echo "    ";
        $this->displayBlock('head_stylesheets', $context, $blocks);
        // line 14
        $this->displayBlock('head_scripts', $context, $blocks);
        // line 27
        $this->displayBlock('head_platform', $context, $blocks);
        // line 28
        echo "
    ";
        // line 29
        $this->displayBlock('head_overrides', $context, $blocks);
        $content = ob_get_clean();
        $assetFunction($content, $location, $priority);
        // line 50
        echo "<head>
    ";
        // line 51
        echo twig_join_filter($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "document", []), "getHtml", [0 => "head_top"], "method"), "
    ");
        echo "
    ";
        // line 52
        $this->displayBlock('head_meta', $context, $blocks);
        // line 78
        $this->displayBlock('head_title', $context, $blocks);
        // line 82
        echo "
    ";
        // line 83
        $this->displayBlock('head_application', $context, $blocks);
        // line 87
        echo "
    ";
        // line 88
        $this->displayBlock('head_ie_stylesheets', $context, $blocks);
        // line 91
        $this->displayBlock('head', $context, $blocks);
        // line 92
        $this->displayBlock('head_custom', $context, $blocks);
        // line 97
        echo twig_join_filter($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "document", []), "getHtml", [0 => "head_bottom"], "method"), "
    ");
        echo "
</head>
";
    }

    // line 7
    public function block_head_stylesheets($context, array $blocks = [])
    {
        // line 8
        echo "<link rel=\"stylesheet\" href=\"gantry-engine://css-compiled/nucleus.css\" type=\"text/css\"/>
        ";
        // line 9
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable((($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", [], "any", false, true), "configuration", [], "any", false, true), "css", [], "any", false, true), "persistent", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", [], "any", false, true), "configuration", [], "any", false, true), "css", [], "any", false, true), "persistent", []), $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", []), "configuration", []), "css", []), "files", []))) : ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", []), "configuration", []), "css", []), "files", []))));
        foreach ($context['_seq'] as $context["_key"] => $context["scss"]) {
            // line 10
            echo "        <link rel=\"stylesheet\" href=\"";
            echo twig_escape_filter($this->env, $context["scss"], "html", null, true);
            echo ".scss\" type=\"text/css\"/>";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['scss'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 12
        echo "    ";
    }

    // line 14
    public function block_head_scripts($context, array $blocks = [])
    {
        // line 15
        if (($context["faEnabled"] ?? null)) {
            // line 16
            echo "            ";
            if (((($context["faVersion"] ?? null) == "manual") || twig_trim_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "fontawesome", []), "html_js_import", [])))) {
                // line 17
                echo "                ";
                echo $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->htmlFilter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "fontawesome", []), "html_js_import", []));
            } elseif ((            // line 18
($context["faVersion"] ?? null) == "fa5js")) {
                // line 19
                echo "                <script type=\"text/javascript\" src=\"";
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc("gantry-assets://js/font-awesome5-all.min.js"), "html", null, true);
                echo "\"></script>
                ";
                // line 20
                if ((($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "fa4_compatibility", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "fa4_compatibility", []), 1)) : (1))) {
                    // line 21
                    echo "                    <script type=\"text/javascript\" src=\"";
                    echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc("gantry-assets://js/font-awesome5-shim.min.js"), "html", null, true);
                    echo "\"></script>
                ";
                }
                // line 23
                echo "            ";
            }
            // line 24
            echo "        ";
        }
        // line 25
        echo "    ";
    }

    // line 27
    public function block_head_platform($context, array $blocks = [])
    {
    }

    // line 29
    public function block_head_overrides($context, array $blocks = [])
    {
        // line 30
        if (($context["faEnabled"] ?? null)) {
            // line 31
            echo "            ";
            if (((($context["faVersion"] ?? null) == "manual") || twig_trim_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "fontawesome", []), "html_css_import", [])))) {
                // line 32
                echo "                ";
                echo $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->htmlFilter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "fontawesome", []), "html_css_import", []));
            } elseif ((            // line 33
($context["faVersion"] ?? null) == "fa4")) {
                // line 34
                echo "                <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome.min.css\" type=\"text/css\"/>
            ";
            } elseif ((            // line 35
($context["faVersion"] ?? null) == "fa5css")) {
                // line 36
                echo "                <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome5-all.min.css\" type=\"text/css\">
                ";
                // line 37
                if ((($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "fa4_compatibility", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "fa4_compatibility", []), 1)) : (1))) {
                    // line 38
                    echo "                    <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome5-shim.min.css\" type=\"text/css\">
                ";
                }
                // line 40
                echo "            ";
            } elseif ((((($context["faVersion"] ?? null) == "fa5js") || ((($context["faVersion"] ?? null) == "manual") && $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "fontawesome", []), "html_js_import", []))) && (($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "content_compatibility", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", [], "any", false, true), "page", [], "any", false, true), "fontawesome", [], "any", false, true), "content_compatibility", []), 1)) : (1)))) {
                // line 41
                echo "                <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome5-pseudo.min.css\" type=\"text/css\">
            ";
            }
            // line 43
            echo "        ";
        }
        // line 44
        echo "        ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", []), "configuration", []), "css", []), "overrides", []));
        foreach ($context['_seq'] as $context["_key"] => $context["scss"]) {
            // line 45
            echo "        <link rel=\"stylesheet\" href=\"";
            echo twig_escape_filter($this->env, $context["scss"], "html", null, true);
            echo ".scss\" type=\"text/css\"/>";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['scss'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 47
        echo "    ";
    }

    // line 52
    public function block_head_meta($context, array $blocks = [])
    {
        // line 53
        echo "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />
        ";
        // line 55
        if ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "head", []), "meta", [])) {
            // line 56
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "head", []), "meta", []));
            foreach ($context['_seq'] as $context["_key"] => $context["attributes"]) {
                // line 57
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($context["attributes"]);
                foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                    // line 58
                    echo "                    ";
                    if ((is_string($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4 = $context["key"]) && is_string($__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 = "og:") && ('' === $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144 || 0 === strpos($__internal_f607aeef2c31a95a7bf963452dff024ffaeb6aafbe4603f9ca3bec57be8633f4, $__internal_62824350bc4502ee19dbc2e99fc6bdd3bd90e7d8dd6e72f42c35efd048542144)))) {
                        // line 59
                        echo "                    <meta property=\"";
                        echo twig_escape_filter($this->env, $context["key"]);
                        echo "\" content=\"";
                        echo twig_escape_filter($this->env, $context["value"]);
                        echo "\" />
                    ";
                    } else {
                        // line 61
                        echo "                    <meta name=\"";
                        echo twig_escape_filter($this->env, $context["key"]);
                        echo "\" content=\"";
                        echo twig_escape_filter($this->env, $context["value"]);
                        echo "\" />
                    ";
                    }
                    // line 63
                    echo "                ";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['attributes'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
        }
        // line 66
        echo twig_join_filter($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "document", []), "getHtml", [0 => "head_meta"], "method"), "
    ");
        echo "

        ";
        // line 68
        if ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "assets", []), "favicon", [])) {
            // line 69
            echo "        <link rel=\"icon\" type=\"image/x-icon\" href=\"";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "assets", []), "favicon", [])), "html", null, true);
            echo "\" />
        ";
        }
        // line 71
        echo "
        ";
        // line 72
        if ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "assets", []), "touchicon", [])) {
            // line 73
            echo "        <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "assets", []), "touchicon", [])), "html", null, true);
            echo "\">
        <link rel=\"icon\" sizes=\"192x192\" href=\"";
            // line 74
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "assets", []), "touchicon", [])), "html", null, true);
            echo "\">
        ";
        }
        // line 76
        echo "    ";
    }

    // line 78
    public function block_head_title($context, array $blocks = [])
    {
        // line 79
        echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />
        <title>Title</title>";
    }

    // line 83
    public function block_head_application($context, array $blocks = [])
    {
        // line 84
        echo twig_join_filter($this->getAttribute(($context["gantry"] ?? null), "styles", [0 => "head"], "method"), "
");
        echo "
        ";
        // line 85
        echo twig_join_filter($this->getAttribute(($context["gantry"] ?? null), "scripts", [0 => "head"], "method"), "
");
    }

    // line 88
    public function block_head_ie_stylesheets($context, array $blocks = [])
    {
    }

    // line 91
    public function block_head($context, array $blocks = [])
    {
    }

    // line 92
    public function block_head_custom($context, array $blocks = [])
    {
        // line 93
        echo "        ";
        if ($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "head", []), "head_bottom", [])) {
            // line 94
            echo "        ";
            echo $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "page", []), "head", []), "head_bottom", []);
            echo "
        ";
        }
        // line 96
        echo "    ";
    }

    public function getTemplateName()
    {
        return "@nucleus/page_head.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  348 => 96,  342 => 94,  339 => 93,  336 => 92,  331 => 91,  326 => 88,  321 => 85,  316 => 84,  313 => 83,  308 => 79,  305 => 78,  301 => 76,  296 => 74,  291 => 73,  289 => 72,  286 => 71,  280 => 69,  278 => 68,  272 => 66,  261 => 63,  253 => 61,  245 => 59,  242 => 58,  238 => 57,  234 => 56,  232 => 55,  228 => 53,  225 => 52,  221 => 47,  213 => 45,  208 => 44,  205 => 43,  201 => 41,  198 => 40,  194 => 38,  192 => 37,  189 => 36,  187 => 35,  184 => 34,  182 => 33,  179 => 32,  176 => 31,  174 => 30,  171 => 29,  166 => 27,  162 => 25,  159 => 24,  156 => 23,  150 => 21,  148 => 20,  143 => 19,  141 => 18,  138 => 17,  135 => 16,  133 => 15,  130 => 14,  126 => 12,  118 => 10,  114 => 9,  111 => 8,  108 => 7,  100 => 97,  98 => 92,  96 => 91,  94 => 88,  91 => 87,  89 => 83,  86 => 82,  84 => 78,  82 => 52,  77 => 51,  74 => 50,  70 => 29,  67 => 28,  65 => 27,  63 => 14,  60 => 7,  48 => 6,  46 => 5,  44 => 4,  42 => 2,  40 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{%- do gantry.debugger.assets() -%}
{%- do gantry.theme.loadAtoms() -%}

{% set faEnabled = gantry.config.page.fontawesome.enable|default(1) %}
{% set faVersion = gantry.config.page.fontawesome.version ?? gantry.config.page.fontawesome.default_version ?? 'fa4' %}
{% assets with { priority: 10 } %}
    {% block head_stylesheets -%}
        <link rel=\"stylesheet\" href=\"gantry-engine://css-compiled/nucleus.css\" type=\"text/css\"/>
        {% for scss in gantry.theme.configuration.css.persistent|default(gantry.theme.configuration.css.files) %}
        <link rel=\"stylesheet\" href=\"{{ scss }}.scss\" type=\"text/css\"/>
        {%- endfor %}
    {% endblock -%}

    {% block head_scripts -%}
        {% if faEnabled %}
            {% if faVersion == 'manual' or gantry.config.page.fontawesome.html_js_import|trim %}
                {{ gantry.config.page.fontawesome.html_js_import|html|raw -}}
            {% elseif faVersion == 'fa5js' %}
                <script type=\"text/javascript\" src=\"{{ url('gantry-assets://js/font-awesome5-all.min.js') }}\"></script>
                {% if gantry.config.page.fontawesome.fa4_compatibility|default(1) %}
                    <script type=\"text/javascript\" src=\"{{ url('gantry-assets://js/font-awesome5-shim.min.js') }}\"></script>
                {% endif %}
            {% endif %}
        {% endif %}
    {% endblock -%}

    {% block head_platform %}{% endblock %}

    {% block head_overrides -%}
        {% if faEnabled %}
            {% if faVersion == 'manual' or gantry.config.page.fontawesome.html_css_import|trim %}
                {{ gantry.config.page.fontawesome.html_css_import|html|raw -}}
            {% elseif faVersion == 'fa4' %}
                <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome.min.css\" type=\"text/css\"/>
            {% elseif faVersion == 'fa5css' %}
                <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome5-all.min.css\" type=\"text/css\">
                {% if gantry.config.page.fontawesome.fa4_compatibility|default(1) %}
                    <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome5-shim.min.css\" type=\"text/css\">
                {% endif %}
            {% elseif (faVersion == 'fa5js' or (faVersion == 'manual' and gantry.config.page.fontawesome.html_js_import)) and (gantry.config.page.fontawesome.content_compatibility|default(1)) %}
                <link rel=\"stylesheet\" href=\"gantry-assets://css/font-awesome5-pseudo.min.css\" type=\"text/css\">
            {% endif %}
        {% endif %}
        {% for scss in gantry.theme.configuration.css.overrides %}
        <link rel=\"stylesheet\" href=\"{{ scss }}.scss\" type=\"text/css\"/>
        {%- endfor %}
    {% endblock -%}
{% endassets -%}

<head>
    {{ gantry.document.getHtml('head_top')|join(\"\\n    \")|raw }}
    {% block head_meta %}
        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\" />
        {% if gantry.config.page.head.meta -%}
            {% for attributes in gantry.config.page.head.meta -%}
                {%- for key, value in attributes %}
                    {% if key starts with 'og:' %}
                    <meta property=\"{{ key|e }}\" content=\"{{ value|e }}\" />
                    {% else %}
                    <meta name=\"{{ key|e }}\" content=\"{{ value|e }}\" />
                    {% endif %}
                {% endfor -%}
            {%- endfor -%}
        {%- endif -%}
        {{ gantry.document.getHtml('head_meta')|join(\"\\n    \")|raw }}

        {% if gantry.config.page.assets.favicon %}
        <link rel=\"icon\" type=\"image/x-icon\" href=\"{{ url(gantry.config.page.assets.favicon) }}\" />
        {% endif %}

        {% if gantry.config.page.assets.touchicon %}
        <link rel=\"apple-touch-icon\" sizes=\"180x180\" href=\"{{ url(gantry.config.page.assets.touchicon) }}\">
        <link rel=\"icon\" sizes=\"192x192\" href=\"{{ url(gantry.config.page.assets.touchicon) }}\">
        {% endif %}
    {% endblock %}

    {%- block head_title -%}
        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />
        <title>Title</title>
    {%- endblock %}

    {% block head_application -%}
        {{ gantry.styles('head')|join(\"\\n\")|raw }}
        {{ gantry.scripts('head')|join(\"\\n\")|raw }}
    {%- endblock %}

    {% block head_ie_stylesheets -%}
    {% endblock -%}

    {% block head %}{% endblock -%}
    {% block head_custom %}
        {% if gantry.config.page.head.head_bottom %}
        {{ gantry.config.page.head.head_bottom|raw }}
        {% endif %}
    {% endblock -%}
    {{ gantry.document.getHtml('head_bottom')|join(\"\\n    \")|raw }}
</head>
", "@nucleus/page_head.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\templates\\page_head.html.twig");
    }
}
