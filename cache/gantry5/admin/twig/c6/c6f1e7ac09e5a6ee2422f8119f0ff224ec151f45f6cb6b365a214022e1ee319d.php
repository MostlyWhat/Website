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

/* @gantry-admin/pages/configurations/layouts/particle.html.twig */
class __TwigTemplate_3436465964a37273704b6feb8309f2cdf511c53fd3b9d3ba162a08c0c1277078 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'gantry' => [$this, 'block_gantry'],
            'title' => [$this, 'block_title'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return $this->loadTemplate((((($context["ajax"] ?? null) - ($context["suffix"] ?? null))) ? ("@gantry-admin/partials/ajax.html.twig") : ("@gantry-admin/partials/base.html.twig")), "@gantry-admin/pages/configurations/layouts/particle.html.twig", 1);
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $this->getParent($context)->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_gantry($context, array $blocks = [])
    {
        // line 4
        echo "<form method=\"post\"
      action=\"";
        // line 5
        echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => ($context["action"] ?? null)], "method"), "html", null, true);
        echo "\"
      data-g-inheritance-settings=\"";
        // line 6
        echo twig_escape_filter($this->env, twig_jsonencode_filter(["id" => $this->getAttribute(($context["item"] ?? null), "id", []), "type" => $this->getAttribute(($context["item"] ?? null), "type", []), "subtype" => $this->getAttribute(($context["item"] ?? null), "subtype", [])]), "html_attr");
        echo "\"
>
    <div class=\"g-tabs\" role=\"tablist\">
        <ul>
            ";
        // line 11
        echo "            <li class=\"active\">
                <a href=\"#\" id=\"g-settings-particle-tab\" role=\"presentation\" aria-controls=\"g-settings-particle\" role=\"tab\" aria-expanded=\"true\">
                    ";
        // line 13
        if (($context["inheritable"] ?? null)) {
            echo "<i class=\"fa fa-fw fa-";
            echo ((($this->getAttribute(($context["item"] ?? null), "inherit", []) && twig_in_filter("attributes", $this->getAttribute($this->getAttribute(($context["item"] ?? null), "inherit", []), "include", [])))) ? ("lock") : ("unlock"));
            echo "\" aria-hidden=\"true\"></i>";
        }
        // line 14
        echo "                    ";
        $this->displayBlock('title', $context, $blocks);
        // line 17
        echo "                </a>
            </li>
            ";
        // line 20
        echo "            ";
        if (($context["extra"] ?? null)) {
            // line 21
            echo "            <li>
                <a href=\"#\" id=\"g-settings-block-tab\" role=\"presentation\" aria-controls=\"g-settings-block\" role=\"tab\" aria-expanded=\"false\">
                    ";
            // line 23
            if (($context["inheritable"] ?? null)) {
                echo "<i class=\"fa fa-fw fa-";
                echo ((($this->getAttribute(($context["item"] ?? null), "inherit", []) && twig_in_filter("block", $this->getAttribute($this->getAttribute(($context["item"] ?? null), "inherit", []), "include", [])))) ? ("lock") : ("unlock"));
                echo "\" aria-hidden=\"true\"></i>";
            }
            // line 24
            echo "                    ";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_BLOCK"), "html", null, true);
            echo "
                </a>
            </li>
            ";
        }
        // line 28
        echo "            ";
        // line 29
        echo "            ";
        if (($context["inheritance"] ?? null)) {
            // line 30
            echo "            <li>
                <a href=\"#\" id=\"g-settings-inheritance-tab\" role=\"presentation\" aria-controls=\"g-settings-inheritance\" aria-expanded=\"false\">
                    ";
            // line 32
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_INHERITANCE"), "html", null, true);
            echo "
                </a>
            </li>
            ";
        }
        // line 36
        echo "        </ul>
    </div>

    <div class=\"g-panes\">
        ";
        // line 41
        echo "        <div class=\"g-pane active\" role=\"tabpanel\" id=\"g-settings-particle\" aria-labelledby=\"g-settings-particle-tab\" aria-expanded=\"true\">
            ";
        // line 42
        $this->loadTemplate("@gantry-admin/pages/configurations/layouts/particle-card.html.twig", "@gantry-admin/pages/configurations/layouts/particle.html.twig", 42)->display(twig_array_merge($context, ["title" => $this->getAttribute(        // line 43
($context["item"] ?? null), "title", []), "blueprints" => $this->getAttribute(        // line 44
($context["particle"] ?? null), "form", []), "overrideable" => (        // line 45
($context["overrideable"] ?? null) && ( !$this->getAttribute($this->getAttribute(($context["particle"] ?? null), "form", [], "any", false, true), "overrideable", [], "any", true, true) || $this->getAttribute($this->getAttribute(($context["particle"] ?? null), "form", []), "overrideable", []))), "inherit" => (((twig_in_filter("attributes", $this->getAttribute($this->getAttribute(        // line 46
($context["item"] ?? null), "inherit", []), "include", [])) && twig_in_filter($this->getAttribute($this->getAttribute(($context["item"] ?? null), "inherit", []), "outline", []), $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["inheritance"] ?? null), "form", []), "fields", []), "outline", []), "filter", [])))) ? ($this->getAttribute($this->getAttribute(($context["item"] ?? null), "inherit", []), "outline", [])) : (null))]));
        // line 48
        echo "        </div>

        ";
        // line 51
        echo "        ";
        if (($context["extra"] ?? null)) {
            // line 52
            echo "        <div class=\"g-pane\" role=\"tabpanel\" id=\"g-settings-block\" aria-labelledby=\"g-settings-block-tab\" aria-expanded=\"false\">
            ";
            // line 53
            $this->loadTemplate("@gantry-admin/pages/configurations/layouts/particle-card.html.twig", "@gantry-admin/pages/configurations/layouts/particle.html.twig", 53)->display(twig_to_array(["gantry" =>             // line 54
($context["gantry"] ?? null), "title" => $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_BLOCK"), "blueprints" => $this->getAttribute(            // line 56
($context["extra"] ?? null), "form", []), "data" => ["block" => $this->getAttribute(            // line 57
($context["item"] ?? null), "block", [])], "prefix" => "block.", "inherit" => (((twig_in_filter("block", $this->getAttribute($this->getAttribute(            // line 59
($context["item"] ?? null), "inherit", []), "include", [])) && twig_in_filter($this->getAttribute($this->getAttribute(($context["item"] ?? null), "inherit", []), "outline", []), $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(($context["inheritance"] ?? null), "form", []), "fields", []), "outline", []), "filter", [])))) ? ($this->getAttribute($this->getAttribute(($context["item"] ?? null), "inherit", []), "outline", [])) : (null))]));
            // line 61
            echo "        </div>
        ";
        }
        // line 63
        echo "
        ";
        // line 65
        echo "        ";
        if (($context["inheritance"] ?? null)) {
            // line 66
            echo "        <div class=\"g-pane\" role=\"tabpanel\" id=\"g-settings-inheritance\" aria-labelledby=\"g-settings-inheritance-tab\" aria-expanded=\"false\">
            <div class=\"card settings-block\">
                <h4>
                    ";
            // line 69
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_INHERITANCE"), "html", null, true);
            echo "
                </h4>
                <div class=\"inner-params\">
                    <input type=\"hidden\" name=\"";
            // line 72
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->fieldNameFilter("inherit.section"), "html", null, true);
            echo "\" value=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["item"] ?? null), "id", []), "html", null, true);
            echo "\" />
                    ";
            // line 73
            $this->loadTemplate("forms/fields.html.twig", "@gantry-admin/pages/configurations/layouts/particle.html.twig", 73)->display(twig_to_array(["gantry" =>             // line 74
($context["gantry"] ?? null), "blueprints" => $this->getAttribute(            // line 75
($context["inheritance"] ?? null), "form", []), "data" => ["inherit" => $this->getAttribute(            // line 76
($context["item"] ?? null), "inherit", [])], "prefix" => "inherit."]));
            // line 79
            echo "                </div>
            </div>
        </div>
        ";
        }
        // line 83
        echo "    </div>

    <div class=\"g-modal-actions\">
        <button class=\"button button-primary\" type=\"submit\">";
        // line 86
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_APPLY"), "html", null, true);
        echo "</button>
        <button class=\"button button-primary\" data-apply-and-save>";
        // line 87
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_APPLY_SAVE"), "html", null, true);
        echo "</button>
        <button class=\"button g5-dialog-close\">";
        // line 88
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_CANCEL"), "html", null, true);
        echo "</button>
    </div>
</form>
";
    }

    // line 14
    public function block_title($context, array $blocks = [])
    {
        // line 15
        echo "                    ";
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_PARTICLE"), "html", null, true);
        echo "
                    ";
    }

    public function getTemplateName()
    {
        return "@gantry-admin/pages/configurations/layouts/particle.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  203 => 15,  200 => 14,  192 => 88,  188 => 87,  184 => 86,  179 => 83,  173 => 79,  171 => 76,  170 => 75,  169 => 74,  168 => 73,  162 => 72,  156 => 69,  151 => 66,  148 => 65,  145 => 63,  141 => 61,  139 => 59,  138 => 57,  137 => 56,  136 => 54,  135 => 53,  132 => 52,  129 => 51,  125 => 48,  123 => 46,  122 => 45,  121 => 44,  120 => 43,  119 => 42,  116 => 41,  110 => 36,  103 => 32,  99 => 30,  96 => 29,  94 => 28,  86 => 24,  80 => 23,  76 => 21,  73 => 20,  69 => 17,  66 => 14,  60 => 13,  56 => 11,  49 => 6,  45 => 5,  42 => 4,  39 => 3,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/pages/configurations/layouts/particle.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\pages\\configurations\\layouts\\particle.html.twig");
    }
}
