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

/* @gantry-admin/pages/configurations/layouts/particle-card.html.twig */
class __TwigTemplate_d46453840c22a6050c2c5c394a477a4b584b95b1cc95d6d95bea8128f6a7e0d1 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 1
        echo "<div class=\"card settings-block\">
    <h4>
        ";
        // line 3
        if (($context["editable"] ?? null)) {
            // line 4
            echo "            <span data-title-editable=\"";
            echo twig_escape_filter($this->env, twig_trim_filter($this->getAttribute(($context["item"] ?? null), "title", [])), "html", null, true);
            echo "\" class=\"title\">";
            echo twig_escape_filter($this->env, twig_trim_filter($this->getAttribute(($context["item"] ?? null), "title", [])), "html", null, true);
            echo "</span>
            <i class=\"fa fa-pencil fa-pencil-alt font-small\" aria-hidden=\"true\" tabindex=\"0\" aria-label=\"";
            // line 5
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EDIT_TITLE", twig_trim_filter($this->getAttribute(($context["item"] ?? null), "title", []))), "html", null, true);
            echo "\" data-title-edit=\"\"></i>
        ";
        } else {
            // line 7
            echo "            ";
            echo twig_escape_filter($this->env, ($context["title"] ?? null), "html", null, true);
            echo "
        ";
        }
        // line 9
        echo "
        ";
        // line 10
        if (($context["item"] ?? null)) {
            // line 11
            echo "            ";
            $context["item_type"] = (($this->getAttribute(($context["item"] ?? null), "subtype", [])) ? ($this->getAttribute(($context["item"] ?? null), "subtype", [])) : ($this->getAttribute(($context["item"] ?? null), "type", [])));
            // line 12
            echo "            ";
            $context["item_disabled"] =  !$this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "get", [0 => (("particles." . ($context["item_type"] ?? null)) . ".enabled"), 1 => true], "method");
            // line 13
            echo "            <span class=\"badge font-small\">";
            echo twig_escape_filter($this->env, ($context["item_type"] ?? null), "html", null, true);
            echo "</span>
            ";
            // line 14
            if ($this->getAttribute($this->getAttribute(($context["blueprints"] ?? null), "fields", []), "enabled", [])) {
                // line 15
                echo "                ";
                $this->loadTemplate("forms/fields/enable/enable.html.twig", "@gantry-admin/pages/configurations/layouts/particle-card.html.twig", 15)->display(twig_array_merge($context, ["name" => (("particles." . ($context["item_type"] ?? null)) . ".enabled"), "field" => $this->getAttribute($this->getAttribute(($context["blueprints"] ?? null), "fields", []), "enabled", []), "value" => $this->getAttribute($this->getAttribute(($context["item"] ?? null), "attributes", []), "enabled", []), "default" => 1, "turned_off" => ($context["item_disabled"] ?? null)]));
                // line 16
                echo "            ";
            }
            // line 17
            echo "        ";
        }
        // line 18
        echo "    </h4>

    <div class=\"inner-params\">
        ";
        // line 21
        $this->loadTemplate("forms/fields.html.twig", "@gantry-admin/pages/configurations/layouts/particle-card.html.twig", 21)->display($context);
        // line 22
        echo "    </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "@gantry-admin/pages/configurations/layouts/particle-card.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  88 => 22,  86 => 21,  81 => 18,  78 => 17,  75 => 16,  72 => 15,  70 => 14,  65 => 13,  62 => 12,  59 => 11,  57 => 10,  54 => 9,  48 => 7,  43 => 5,  36 => 4,  34 => 3,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/pages/configurations/layouts/particle-card.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\pages\\configurations\\layouts\\particle-card.html.twig");
    }
}
