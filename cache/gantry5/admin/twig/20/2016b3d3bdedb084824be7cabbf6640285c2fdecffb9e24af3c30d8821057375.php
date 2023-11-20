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

/* forms/fields/enable/enable.html.twig */
class __TwigTemplate_92ee76f0602adb278df00cb7c07561d0b35e527049d7c4c3090bb516e597f070 extends \Twig\Template
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
        return $this->loadTemplate(((($context["default"] ?? null)) ? ("partials/field.html.twig") : ((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"))), "forms/fields/enable/enable.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    <span class=\"enabler\" role=\"checkbox\" aria-checked=\"";
        echo ((($context["value"] ?? null)) ? ("true") : ("false"));
        echo "\" tabindex=\"0\" aria-label=\"";
        ((($context["turned_off"] ?? null)) ? (print ("Disabled")) : (print (twig_escape_filter($this->env, ("Enables " . _twig_default_filter(twig_trim_filter(twig_title_string_filter($this->env, twig_replace_filter(($context["scope"] ?? null), ["." => " "]))), twig_trim_filter(($context["title"] ?? null)))), "html", null, true))));
        echo "\">
    <input
            ";
        // line 7
        echo "            type=\"hidden\"
            name=\"";
        // line 8
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
        echo "\"
            value=\"";
        // line 9
        echo ((($context["value"] ?? null)) ? (1) : (0));
        echo "\"
            ";
        // line 10
        if (($context["disabled"] ?? null)) {
            echo "disabled=\"disabled\"";
        }
        // line 11
        echo "            ";
        // line 12
        echo "            ";
        $this->displayBlock("global_attributes", $context, $blocks);
        echo "
            />
    ";
        // line 14
        if (($context["turned_off"] ?? null)) {
            // line 15
            echo "    <span><i class=\"fa fa-ban\" aria-hidden=\"true\"></i></span>
    ";
        } else {
            // line 17
            echo "    <span class=\"toggle\"><span class=\"knob\"></span></span>
    ";
        }
        // line 19
        echo "</span>
";
    }

    public function getTemplateName()
    {
        return "forms/fields/enable/enable.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  82 => 19,  78 => 17,  74 => 15,  72 => 14,  66 => 12,  64 => 11,  60 => 10,  56 => 9,  52 => 8,  49 => 7,  41 => 4,  38 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/enable/enable.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\enable\\enable.html.twig");
    }
}
