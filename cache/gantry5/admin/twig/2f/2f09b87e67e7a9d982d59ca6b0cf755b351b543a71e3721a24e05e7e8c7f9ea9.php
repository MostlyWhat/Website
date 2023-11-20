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

/* forms/fields/input/colorpicker.html.twig */
class __TwigTemplate_40fd167106cb3edf9b345f0fc115376cf8d68a80ccae20f6250a0f5af4a4150d extends \Twig\Template
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
        return "forms/fields/input/group/group.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->parent = $this->loadTemplate("forms/fields/input/group/group.html.twig", "forms/fields/input/colorpicker.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_input($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $context["field"] = twig_array_merge(($context["field"] ?? null), ["style" => ("background-color: " . ($context["value"] ?? null)), "pattern" => "^#([a-fA-F0-9]{6})|(rgba\\(\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*(0|[1-9]\\d?|1\\d\\d?|2[0-4]\\d|25[0-5])\\s*,\\s*((0.[0-9]+)|[01])\\s*\\))\$"]);
        // line 5
        echo "    <div class=\"g-colorpicker ";
        (($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->colorContrastFunc(twig_lower_filter($this->env, ($context["value"] ?? null)))) ? (print (twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->colorContrastFunc(twig_lower_filter($this->env, ($context["value"] ?? null))), "html", null, true))) : (print ("light-text")));
        echo "\">
        <input
                ";
        // line 8
        echo "                type=\"text\"
                name=\"";
        // line 9
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter((($context["scope"] ?? null) . ($context["name"] ?? null))), "html", null, true);
        echo "\"
                value=\"";
        // line 10
        echo twig_escape_filter($this->env, twig_lower_filter($this->env, twig_join_filter(($context["value"] ?? null), ", ")), "html", null, true);
        echo "\"
                ";
        // line 12
        echo "                ";
        $this->displayBlock("global_attributes", $context, $blocks);
        echo "
                ";
        // line 14
        echo "                ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "autocomplete", []), [0 => "on", 1 => "off"])) {
            echo "autocomplete=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "autocomplete", []), "html", null, true);
            echo "\"";
        }
        // line 15
        echo "                ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "autofocus", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "autofocus=\"autofocus\"";
        }
        // line 16
        echo "                ";
        if ($this->getAttribute(($context["field"] ?? null), "pattern", [], "any", true, true)) {
            echo "pattern=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "pattern", []), "html", null, true);
            echo "\"";
        }
        // line 17
        echo "                ";
        if (twig_in_filter($this->getAttribute(($context["field"] ?? null), "disabled", []), [0 => "on", 1 => "true", 2 => 1])) {
            echo "disabled=\"disabled\"";
        }
        // line 18
        echo "                ";
        if ($this->getAttribute(($context["field"] ?? null), "list", [], "any", true, true)) {
            echo "list=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["field"] ?? null), "list", []), "html", null, true);
            echo "\"";
        }
        // line 19
        echo "        />
        <i class=\"fa fa-tint\" aria-hidden=\"true\"></i>
    </div>
";
    }

    public function getTemplateName()
    {
        return "forms/fields/input/colorpicker.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  98 => 19,  91 => 18,  86 => 17,  79 => 16,  74 => 15,  67 => 14,  62 => 12,  58 => 10,  54 => 9,  51 => 8,  45 => 5,  42 => 4,  39 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "forms/fields/input/colorpicker.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\forms\\fields\\input\\colorpicker.html.twig");
    }
}
