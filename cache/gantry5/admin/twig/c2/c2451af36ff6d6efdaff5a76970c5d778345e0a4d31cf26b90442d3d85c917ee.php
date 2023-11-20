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

/* forms/fields/input/fonts.html.twig */
class __TwigTemplate_998fb6a196c347e18b7079ec494a6de41e763d287c2adbbc1ef0d538c1d9fe76 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'input' => [$this, 'block_input'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate(((($context["default"] ?? null)) ? ("partials/field.html.twig") : ((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"))), "forms/fields/input/fonts.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $context["local_fonts"] = (($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", [], "any", false, true), "details", [], "any", false, true), "configuration", [], "any", false, true), "fonts", [], "array", true, true)) ? (_twig_default_filter($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "theme", [], "any", false, true), "details", [], "any", false, true), "configuration", [], "any", false, true), "fonts", [], "array"), [])) : ([]));
        // line 5
        echo "    ";
        $context["map"] = [];
        // line 6
        echo "    ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["local_fonts"] ?? null));
        foreach ($context['_seq'] as $context["name"] => $context["variants"]) {
            // line 7
            echo "        ";
            if (twig_test_iterable($context["variants"])) {
                $context["variants"] = twig_get_array_keys_filter($context["variants"]);
                // line 8
                echo "        ";
            } else {
                $context["variants"] = [0 => "regular"];
            }
            // line 9
            echo "        ";
            $context["map"] = twig_array_merge(($context["map"] ?? null), [0 => ["family" => $context["name"], "variants" => $context["variants"]]]);
            // line 10
            echo "    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['name'], $context['variants'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 11
        echo "
    <div class=\"g-fonts\">
        <div class=\"input-group append\">
            <input
                    ";
        // line 16
        echo "                    type=\"text\"
                    name=\"";
        // line 17
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
        echo "\"
                    value=\"";
        // line 18
        echo twig_escape_filter($this->env, twig_join_filter(($context["value"] ?? null), ", "), "html", null, true);
        echo "\"
                    ";
        // line 20
        echo "                    ";
        $this->displayBlock("global_attributes", $context, $blocks);
        echo "
                    ";
        // line 22
        echo "                    ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "autocomplete", []), [0 => "on", 1 => "off"])) {
            echo "autocomplete=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "autocomplete", []), "html", null, true);
            echo "\"";
        }
        // line 23
        echo "                    ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "autofocus", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "autofocus=\"autofocus\"";
        }
        // line 24
        echo "                    ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "disabled", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "disabled=\"disabled\"";
        }
        // line 25
        echo "                    ";
        if ($this->getAttribute(($context["field"] ?? null), "list", [], "any", true, true)) {
            echo "list=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "list", []), "html", null, true);
            echo "\"";
        }
        // line 26
        echo "                    />
            ";
        // line 27
        $context["picker"] = ["field" => (("input[name=\"" . twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))))) . "\"]")];
        // line 28
        echo "            <span class=\"input-group-btn\">
                <button class=\"button\" type=\"button\" aria-label=\"";
        // line 29
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SELECT"), "html", null, true);
        echo " ";
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "label", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "LABEL"), "html", null, true);
        echo "\" data-g5-fontpicker=\"";
        echo twig_escape_filter($this->env, twig_jsonencode_filter(($context["picker"] ?? null)), "html_attr");
        echo "\">
                    <i class=\"fa fa-font\" aria-hidden=\"true\"></i>
                </button>
            </span>
        </div>
    </div>
";
    }

    public function getTemplateName()
    {
        return "forms/fields/input/fonts.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  124 => 29,  121 => 28,  119 => 27,  116 => 26,  109 => 25,  104 => 24,  99 => 23,  92 => 22,  87 => 20,  83 => 18,  79 => 17,  76 => 16,  70 => 11,  64 => 10,  61 => 9,  56 => 8,  52 => 7,  47 => 6,  44 => 5,  41 => 4,  38 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/input/fonts.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\input\\fonts.html.twig");
    }
}
