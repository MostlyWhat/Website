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

/* @gantry-admin/pages/configurations/styles/styles.html.twig */
class __TwigTemplate_0a0f5cd247febf59f17915184ab625ac3c1c0d3346d36f8b226d9cf1c31f39c7 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'gantry' => [$this, 'block_gantry'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate((((($context["ajax"] ?? null) - ($context["suffix"] ?? null))) ? ("@gantry-admin/partials/ajax.html.twig") : ("@gantry-admin/partials/base.html.twig")), "@gantry-admin/pages/configurations/styles/styles.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_gantry($context, array $blocks = [])
    {
        // line 4
        $context["labels"] = ["collapse" => $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_COLLAPSE"), "expand" => $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EXPAND")];
        // line 5
        $context["defaultStyles"] = $this->getAttribute(($context["defaults"] ?? null), "flatten", [0 => "styles", 1 => "][", 2 => "styles"], "method");
        // line 6
        echo "
<div id=\"styles\">
    ";
        // line 8
        $context["stored_data"] = $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->jsonDecodeFilter(_twig_default_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->getCookie("g5-collapsed"), "{}"));
        // line 9
        echo "    <form method=\"post\" action=\"";
        echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => "configurations", 1 => ($context["configuration"] ?? null), 2 => "styles"], "method"), "html", null, true);
        echo "\">
        <span class=\"float-right\">
            <a href=\"";
        // line 11
        echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => "configurations", 1 => ($context["configuration"] ?? null), 2 => "styles/compile"], "method"), "html", null, true);
        echo "\"
               title=\"";
        // line 12
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_RECOMPILE_CSS"), "html", null, true);
        echo "\"
               aria-label=\"";
        // line 13
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_RECOMPILE_CSS"), "html", null, true);
        echo "\"
               class=\"button button-secondary\"
               data-ajax-action=\"\"
            >
                <i class=\"fa fa-fw fa-tasks\" aria-hidden=\"true\"></i> <span>";
        // line 17
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_RECOMPILE_CSS"), "html", null, true);
        echo "</span>
            </a>
            <button type=\"submit\" class=\"button button-primary button-save\" data-save=\"Styles\">
                <i class=\"fa fa-fw fa-check\" aria-hidden=\"true\"></i> <span>";
        // line 20
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SAVE_STYLES"), "html", null, true);
        echo "</span>
            </button>
        </span>

        ";
        // line 24
        $context["presets"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", []), "presets", []);
        // line 25
        echo "        ";
        if ($this->getAttribute(($context["presets"] ?? null), "count", [], "method")) {
            // line 26
            echo "        ";
            $context["collapsed"] = $this->getAttribute(($context["stored_data"] ?? null), "swatches");
            // line 27
            echo "        <h2 class=\"page-title";
            echo ((($context["collapsed"] ?? null)) ? (" g-collapsed-main") : (""));
            echo "\"
            data-g-collapse=\"";
            // line 28
            echo twig_escape_filter($this->env, twig_jsonencode_filter(twig_array_merge(($context["labels"] ?? null), ["collapsed" => ((($context["collapsed"] ?? null)) ? (true) : (false)), "id" => "swatches", "target" => "~ .swatches-container"])), "html_attr");
            echo "\"
            data-g-collapse-id=\"swatches\"
        >
            <span class=\"title\">";
            // line 31
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_STYLES"), "html", null, true);
            echo "</span>
            <span class=\"g-collapse\" data-title=\"";
            // line 32
            echo twig_escape_filter($this->env, ((($context["collapsed"] ?? null)) ? ($this->getAttribute(($context["labels"] ?? null), "expand", [])) : ($this->getAttribute(($context["labels"] ?? null), "collapse", []))), "html", null, true);
            echo "\" data-tip=\"";
            echo twig_escape_filter($this->env, ((($context["collapsed"] ?? null)) ? ($this->getAttribute(($context["labels"] ?? null), "expand", [])) : ($this->getAttribute(($context["labels"] ?? null), "collapse", []))), "html", null, true);
            echo "\" data-tip-place=\"top-right\" data-tip-spacing=\"0\">
                <i class=\"fa fa-fw  fa-caret-up\" aria-hidden=\"true\"></i>
            </span>
        </h2>

        <div class=\"swatches-container";
            // line 37
            echo ((($context["collapsed"] ?? null)) ? (" g-collapsed") : (""));
            echo "\"";
            if (($context["defaultStyles"] ?? null)) {
                echo " data-g-styles-defaults=\"";
                echo twig_escape_filter($this->env, twig_jsonencode_filter(($context["defaultStyles"] ?? null)), "html_attr");
                echo "\"";
            }
            echo ">
            <div class=\"swatches-block\">
                ";
            // line 39
            $context["presetKey"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "get", [0 => "styles.preset"], "method");
            // line 40
            echo "
                <ul class=\"g-grid\">
                    ";
            // line 42
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["presets"] ?? null));
            foreach ($context['_seq'] as $context["key"] => $context["preset"]) {
                // line 43
                echo "                        ";
                $context["presetKey"] = (( !($context["presetKey"] ?? null)) ? ($context["key"]) : (($context["presetKey"] ?? null)));
                // line 44
                echo "                        ";
                $context["counter"] = 0;
                // line 45
                echo "                        <li class=\"g-block";
                echo (((($context["presetKey"] ?? null) == $context["key"])) ? (" g-preset-match") : (""));
                echo "\">
                            <a href=\"#\" class=\"swatch\" data-g-styles=\"";
                // line 46
                echo twig_escape_filter($this->env, twig_jsonencode_filter($this->getAttribute($this->getAttribute(($context["presets"] ?? null), "def", [0 => ($context["key"] . ".styles.preset"), 1 => $context["key"]], "method"), "flatten", [0 => ($context["key"] . ".styles"), 1 => "][", 2 => "styles"], "method")), "html_attr");
                echo "\">
                                <img src=\"";
                // line 47
                echo twig_escape_filter($this->env, _twig_default_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute($context["preset"], "image", [])), $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc("gantry-admin://images/placeholder.png")), "html", null, true);
                echo "\" class=\"swatch-image\" alt=\"";
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_STYLES_APPLY"), "html", null, true);
                echo " ";
                echo $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter($this->getAttribute($context["preset"], "description", []));
                echo "\"/>
                                ";
                // line 48
                if (twig_length_filter($this->env, $this->getAttribute($context["preset"], "colors", []))) {
                    // line 49
                    echo "                                    ";
                    $context["stop"] = twig_number_format_filter($this->env, (100 / twig_length_filter($this->env, $this->getAttribute($context["preset"], "colors", []))), 3, ".");
                    // line 50
                    echo "                                    <span class=\"swatch-colors\"
                                            ";
                    // line 52
                    echo "                                          style=\"background: linear-gradient(to right
                                          ";
                    // line 53
                    $context['_parent'] = $context;
                    $context['_seq'] = twig_ensure_traversable($this->getAttribute($context["preset"], "colors", []));
                    foreach ($context['_seq'] as $context["_key"] => $context["color"]) {
                        // line 54
                        echo ",";
                        echo twig_escape_filter($this->env, $context["color"], "html", null, true);
                        echo " ";
                        echo twig_escape_filter($this->env, ($context["counter"] ?? null), "html", null, true);
                        echo "%,";
                        echo twig_escape_filter($this->env, $context["color"], "html", null, true);
                        echo " ";
                        echo twig_escape_filter($this->env, (($context["counter"] ?? null) + ($context["stop"] ?? null)), "html", null, true);
                        echo "%
                                          ";
                        // line 55
                        $context["counter"] = (($context["counter"] ?? null) + ($context["stop"] ?? null));
                    }
                    $_parent = $context['_parent'];
                    unset($context['_seq'], $context['_iterated'], $context['_key'], $context['color'], $context['_parent'], $context['loop']);
                    $context = array_intersect_key($context, $_parent) + $_parent;
                    // line 56
                    echo ")\">
                    </span>
                                ";
                }
                // line 59
                echo "                                <button class=\"swatch-preview\" aria-label=\"";
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_STYLES_PREVIEW"), "html", null, true);
                echo " ";
                echo $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter($this->getAttribute($context["preset"], "description", []));
                echo "\"><i class=\"fa fa-fw fa-eye\" aria-hidden=\"true\"></i></button>
                                <span class=\"swatch-matched\"><i class=\"fa fa-fw fa-star\" aria-hidden=\"true\"></i></span>
                            </a>
                            <span class=\"swatch-description\"><span class=\"swatch-title-matched\"><i class=\"fa fa-fw fa-star\" aria-hidden=\"true\"></i></span> ";
                // line 62
                echo $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter($this->getAttribute($context["preset"], "description", []));
                echo "</span>
                        </li>
                    ";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['preset'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 65
            echo "                </ul>
            </div>
        </div>

        <input type=\"hidden\" name=\"styles[preset]\" value=\"";
            // line 69
            echo twig_escape_filter($this->env, ($context["presetKey"] ?? null), "html", null, true);
            echo "\" />
        ";
        }
        // line 71
        echo "
        ";
        // line 72
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["blocks"] ?? null));
        $context['loop'] = [
          'parent' => $context['_parent'],
          'index0' => 0,
          'index'  => 1,
          'first'  => true,
        ];
        if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
            $length = count($context['_seq']);
            $context['loop']['revindex0'] = $length - 1;
            $context['loop']['revindex'] = $length;
            $context['loop']['length'] = $length;
            $context['loop']['last'] = 1 === $length;
        }
        foreach ($context['_seq'] as $context["group"] => $context["list"]) {
            // line 73
            echo "        ";
            if (($context["group"] != "hidden")) {
                // line 74
                echo "        <h2>";
                echo twig_escape_filter($this->env, twig_capitalize_string_filter($this->env, $context["group"]), "html", null, true);
                echo " ";
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_STYLES"), "html", null, true);
                echo "</h2>

        <div class=\"g-filter-actions\">
            <div class=\"g-panel-filters\" data-g-global-filter=\"\">
                <div class=\"search settings-block\">
                    <input type=\"text\" data-g-collapse-filter placeholder=\"";
                // line 79
                echo twig_escape_filter($this->env, (($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILTER") . " ") . twig_capitalize_string_filter($this->env, $context["group"])), "html", null, true);
                echo "...\" aria-label=\"";
                echo twig_escape_filter($this->env, (($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_FILTER") . " ") . twig_capitalize_string_filter($this->env, $context["group"])), "html", null, true);
                echo "...\" role=\"search\">
                    <i class=\"fa fa-fw fa-search\" aria-hidden=\"true\"></i>
                </div>
                <button class=\"button\" type=\"button\" data-g-collapse-all=\"true\"><i class=\"far fa-fw fa-caret-square-up\" aria-hidden=\"true\"></i> ";
                // line 82
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_COLLAPSE_ALL"), "html", null, true);
                echo "</button>
                <button class=\"button\" type=\"button\" data-g-collapse-all=\"false\"><i class=\"far fa-fw fa-caret-square-down\" aria-hidden=\"true\"></i> ";
                // line 83
                echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EXPAND_ALL"), "html", null, true);
                echo "</button>
            </div>
        </div>

        <div id=\"styles\" class=\"cards-wrapper g-grid\">

            ";
                // line 89
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable($context["list"]);
                $context['loop'] = [
                  'parent' => $context['_parent'],
                  'index0' => 0,
                  'index'  => 1,
                  'first'  => true,
                ];
                if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof \Countable)) {
                    $length = count($context['_seq']);
                    $context['loop']['revindex0'] = $length - 1;
                    $context['loop']['revindex'] = $length;
                    $context['loop']['length'] = $length;
                    $context['loop']['last'] = 1 === $length;
                }
                foreach ($context['_seq'] as $context["id"] => $context["block"]) {
                    // line 90
                    echo "                ";
                    $context["block"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "styles", []), "getBlueprintForm", [0 => $context["id"]], "method");
                    // line 91
                    echo "                ";
                    $context["prefix"] = (("styles." . $context["id"]) . ".");
                    // line 92
                    echo "                ";
                    $context["collapsed"] = ($this->getAttribute($this->getAttribute($context["block"], "form", []), "collapsed", []) || $this->getAttribute(($context["stored_data"] ?? null), ($context["prefix"] ?? null)));
                    // line 93
                    echo "                <div class=\"card settings-block";
                    echo ((($context["collapsed"] ?? null)) ? (" g-collapsed") : (""));
                    echo "\">
                    <h4 data-g-collapse=\"";
                    // line 94
                    echo twig_escape_filter($this->env, twig_jsonencode_filter(twig_array_merge(($context["labels"] ?? null), ["collapsed" => ((($context["collapsed"] ?? null)) ? (true) : (false)), "id" => ($context["prefix"] ?? null), "target" => "~ .inner-params"])), "html_attr");
                    echo "\" data-g-collapse-id=\"";
                    echo twig_escape_filter($this->env, ($context["prefix"] ?? null), "html", null, true);
                    echo "\">
                        <span class=\"g-collapse\" data-title=\"";
                    // line 95
                    echo twig_escape_filter($this->env, ((($context["collapsed"] ?? null)) ? ($this->getAttribute(($context["labels"] ?? null), "expand", [])) : ($this->getAttribute(($context["labels"] ?? null), "collapse", []))), "html", null, true);
                    echo "\" data-tip=\"";
                    echo twig_escape_filter($this->env, ((($context["collapsed"] ?? null)) ? ($this->getAttribute(($context["labels"] ?? null), "expand", [])) : ($this->getAttribute(($context["labels"] ?? null), "collapse", []))), "html", null, true);
                    echo "\" data-tip-place=\"top-right\">
                            <i class=\"fa fa-fw fa-caret-up\" aria-hidden=\"true\"></i>
                        </span>
                        <span class=\"g-title\">";
                    // line 98
                    echo twig_escape_filter($this->env, $this->getAttribute($context["block"], "name", []), "html", null, true);
                    echo "</span>
                    </h4>
                    <div class=\"inner-params\">
                        ";
                    // line 101
                    $this->loadTemplate("forms/fields.html.twig", "@gantry-admin/pages/configurations/styles/styles.html.twig", 101)->display(twig_array_merge($context, ["overrideable" => ($context["overrideable"] ?? null), "blueprints" => $this->getAttribute($context["block"], "form", []), "data" => ($context["data"] ?? null)]));
                    // line 102
                    echo "                    </div>
                </div>
            ";
                    ++$context['loop']['index0'];
                    ++$context['loop']['index'];
                    $context['loop']['first'] = false;
                    if (isset($context['loop']['length'])) {
                        --$context['loop']['revindex0'];
                        --$context['loop']['revindex'];
                        $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                    }
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['id'], $context['block'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 105
                echo "        </div>
        ";
            }
            // line 107
            echo "        ";
            ++$context['loop']['index0'];
            ++$context['loop']['index'];
            $context['loop']['first'] = false;
            if (isset($context['loop']['length'])) {
                --$context['loop']['revindex0'];
                --$context['loop']['revindex'];
                $context['loop']['last'] = 0 === $context['loop']['revindex0'];
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['group'], $context['list'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 108
        echo "
        <div class=\"g-footer-actions\">
            <span class=\"float-right\">
                <a href=\"";
        // line 111
        echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => "configurations", 1 => ($context["configuration"] ?? null), 2 => "styles/compile"], "method"), "html", null, true);
        echo "\"
                   role=\"button\"
                   title=\"";
        // line 113
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_RECOMPILE_CSS"), "html", null, true);
        echo "\"
                   aria-label=\"";
        // line 114
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_RECOMPILE_CSS"), "html", null, true);
        echo "\"
                   class=\"button button-secondary\"
                   data-ajax-action=\"\"
                >
                    <i class=\"fa fa-fw fa-tasks\" aria-hidden=\"true\"></i> <span>";
        // line 118
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_RECOMPILE_CSS"), "html", null, true);
        echo "</span>
                </a>
                <button type=\"submit\" class=\"button button-primary button-save\" data-save=\"";
        // line 120
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_STYLES"), "html", null, true);
        echo "\"><i class=\"fa fa-fw fa-check\" aria-hidden=\"true\"></i> <span>";
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SAVE_STYLES"), "html", null, true);
        echo "</span></button>
            </span>
        </div>
    </form>
</div>
";
    }

    public function getTemplateName()
    {
        return "@gantry-admin/pages/configurations/styles/styles.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  396 => 120,  391 => 118,  384 => 114,  380 => 113,  375 => 111,  370 => 108,  356 => 107,  352 => 105,  336 => 102,  334 => 101,  328 => 98,  320 => 95,  314 => 94,  309 => 93,  306 => 92,  303 => 91,  300 => 90,  283 => 89,  274 => 83,  270 => 82,  262 => 79,  251 => 74,  248 => 73,  231 => 72,  228 => 71,  223 => 69,  217 => 65,  208 => 62,  199 => 59,  194 => 56,  188 => 55,  177 => 54,  173 => 53,  170 => 52,  167 => 50,  164 => 49,  162 => 48,  154 => 47,  150 => 46,  145 => 45,  142 => 44,  139 => 43,  135 => 42,  131 => 40,  129 => 39,  118 => 37,  108 => 32,  104 => 31,  98 => 28,  93 => 27,  90 => 26,  87 => 25,  85 => 24,  78 => 20,  72 => 17,  65 => 13,  61 => 12,  57 => 11,  51 => 9,  49 => 8,  45 => 6,  43 => 5,  41 => 4,  38 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/pages/configurations/styles/styles.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\pages\\configurations\\styles\\styles.html.twig");
    }
}
