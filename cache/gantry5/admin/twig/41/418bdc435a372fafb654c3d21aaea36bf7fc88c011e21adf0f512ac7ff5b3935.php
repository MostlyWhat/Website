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

/* forms/fields/input/filepicker.html.twig */
class __TwigTemplate_9164356c0f5744ae21d787bfab2ce70a76b8d0010d785c0d180c76e5cb0d61ec extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'input' => [$this, 'block_input'],
            'reset_field' => [$this, 'block_reset_field'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate(((($context["default"] ?? null)) ? ("partials/field.html.twig") : ((("forms/" . ((array_key_exists("layout", $context)) ? (_twig_default_filter(($context["layout"] ?? null), "field")) : ("field"))) . ".html.twig"))), "forms/fields/input/filepicker.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    <div class=\"g-filepicker\">
        <div class=\"input-group append\">
            <input
                    ";
        // line 8
        echo "                    type=\"text\"
                    name=\"";
        // line 9
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
        echo "\"
                    value=\"";
        // line 10
        echo twig_escape_filter($this->env, twig_join_filter(($context["value"] ?? null), ", "), "html", null, true);
        echo "\"
                    ";
        // line 12
        echo "                    ";
        $this->displayBlock("global_attributes", $context, $blocks);
        echo "
                    ";
        // line 14
        echo "                    ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "autocomplete", []), [0 => "on", 1 => "off"])) {
            echo "autocomplete=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "autocomplete", []), "html", null, true);
            echo "\"";
        }
        // line 15
        echo "                    ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "autofocus", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "autofocus=\"autofocus\"";
        }
        // line 16
        echo "                    ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "disabled", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "disabled=\"disabled\"";
        }
        // line 17
        echo "                    ";
        if ($this->getAttribute(($context["field"] ?? null), "list", [], "any", true, true)) {
            echo "list=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "list", []), "html", null, true);
            echo "\"";
        }
        // line 18
        echo "                    ";
        if ($this->getAttribute(($context["field"] ?? null), "placeholder", [], "any", true, true)) {
            echo "placeholder=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "placeholder", []), "html", null, true);
            echo "\"";
        }
        // line 19
        echo "                    />
            ";
        // line 20
        $context["picker"] = ["field" => (("input[name=\"" . twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))))) . "\"]"), "root" => twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "root", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["field"] ?? null), "root", []), "gantry-media://")) : ("gantry-media://"))), "filter" => twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "filter", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["field"] ?? null), "filter", []), false)) : (false)))];
        // line 21
        echo "            <span class=\"input-group-btn\">
                <button class=\"button\" type=\"button\" aria-label=\"";
        // line 22
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_SELECT"), "html", null, true);
        echo " ";
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transKeyFilter($this->getAttribute(($context["field"] ?? null), "label", []), "GANTRY5_FORM_FIELD", ($context["scope"] ?? null), ($context["name"] ?? null), "LABEL"), "html", null, true);
        echo "\" data-g5-filepicker=\"";
        echo twig_escape_filter($this->env, twig_jsonencode_filter(($context["picker"] ?? null)), "html_attr");
        echo "\">
                    <i class=\"far ";
        // line 23
        echo twig_escape_filter($this->env, (($this->getAttribute(($context["field"] ?? null), "icon", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["field"] ?? null), "icon", []), "fa-copy")) : ("fa-copy")), "html", null, true);
        echo "\" aria-hidden=\"true\" ></i>
                </button>
            </span>
            ";
        // line 26
        $this->displayBlock('reset_field', $context, $blocks);
        // line 27
        echo "        </div>
    </div>
";
    }

    // line 26
    public function block_reset_field($context, array $blocks = [])
    {
        $this->displayParentBlock("reset_field", $context, $blocks);
    }

    public function getTemplateName()
    {
        return "forms/fields/input/filepicker.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  124 => 26,  118 => 27,  116 => 26,  110 => 23,  102 => 22,  99 => 21,  97 => 20,  94 => 19,  87 => 18,  80 => 17,  75 => 16,  70 => 15,  63 => 14,  58 => 12,  54 => 10,  50 => 9,  47 => 8,  42 => 4,  39 => 3,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/input/filepicker.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\input\\filepicker.html.twig");
    }
}
