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

/* forms/fields/input/hidden.html.twig */
class __TwigTemplate_d504cc8bb181c6f1e43c4c9705f8912a0989046ca5896e0bd1df754335779a02 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'overridable' => [$this, 'block_overridable'],
            'label' => [$this, 'block_label'],
            'input' => [$this, 'block_input'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate(((($context["default"] ?? null)) ? ("partials/field.html.twig") : ((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"))), "forms/fields/input/hidden.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 4
    public function block_overridable($context, array $blocks = [])
    {
    }

    // line 8
    public function block_label($context, array $blocks = [])
    {
    }

    // line 11
    public function block_input($context, array $blocks = [])
    {
        // line 12
        echo "    ";
        if ($this->getAttribute(($context["field"] ?? null), "array", [])) {
            // line 13
            echo "        ";
            $context["name"] = (($context["name"] ?? null) . "._json");
            // line 14
            echo "        ";
            $context["value"] = twig_jsonencode_filter(((array_key_exists("value", $context)) ? (_twig_default_filter(($context["value"] ?? null), [])) : ([])));
            // line 15
            echo "        ";
        } else {
            // line 16
            echo "        ";
            $context["value"] = twig_join_filter(($context["value"] ?? null), ", ");
            // line 17
            echo "    ";
        }
        // line 18
        echo "
    <input
        ";
        // line 21
        echo "        type=\"hidden\"
        name=\"";
        // line 22
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
        echo "\"
        value=\"";
        // line 23
        echo twig_escape_filter($this->env, ($context["value"] ?? null), "html", null, true);
        echo "\"
        ";
        // line 25
        echo "        ";
        $this->displayBlock("global_attributes", $context, $blocks);
        echo "
    />
";
    }

    public function getTemplateName()
    {
        return "forms/fields/input/hidden.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  86 => 25,  82 => 23,  78 => 22,  75 => 21,  71 => 18,  68 => 17,  65 => 16,  62 => 15,  59 => 14,  56 => 13,  53 => 12,  50 => 11,  45 => 8,  40 => 4,  31 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/input/hidden.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\input\\hidden.html.twig");
    }
}
