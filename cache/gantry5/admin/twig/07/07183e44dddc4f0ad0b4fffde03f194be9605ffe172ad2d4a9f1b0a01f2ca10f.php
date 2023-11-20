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

/* partials/configuration-selector.html.twig */
class __TwigTemplate_d2482164b8641640d279e37249afaf857e0cdff14512e128a9d30bf724036e55 extends \Twig\Template
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
        echo "<li class=\"config-select-wrap\">
    ";
        // line 2
        $context["selected_title"] = (((($context["configuration"] ?? null) == "default")) ? ($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_BASE_OUTLINE")) : (""));
        // line 3
        echo "    ";
        $context["selected_value"] = (((($context["configuration"] ?? null) == "default")) ? ("default") : (""));
        // line 4
        echo "    ";
        $context["selected_editable"] = true;
        // line 5
        echo "    <select id=\"configuration-selector\" class=\"config-select\" data-selectize-ajaxify data-selectize=\"";
        echo twig_escape_filter($this->env, twig_jsonencode_filter(["allowEmptyOption" => true]), "html_attr");
        echo "\">
        ";
        // line 6
        $this->loadTemplate("partials/outlines-list.html.twig", "partials/configuration-selector.html.twig", 6)->display($context);
        // line 7
        echo "    </select>

    ";
        // line 9
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "outlines", []), "user", []));
        foreach ($context['_seq'] as $context["name"] => $context["title"]) {
            // line 10
            echo "        ";
            if (($context["name"] == ($context["configuration"] ?? null))) {
                // line 11
                echo "            ";
                $context["selected_title"] = $context["title"];
                // line 12
                echo "            ";
                $context["selected_value"] = $context["name"];
                // line 13
                echo "        ";
            }
            // line 14
            echo "    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['name'], $context['title'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 15
        echo "    ";
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "outlines", []), "system", []));
        foreach ($context['_seq'] as $context["name"] => $context["title"]) {
            // line 16
            echo "        ";
            if (($context["name"] == ($context["configuration"] ?? null))) {
                // line 17
                echo "            ";
                $context["selected_title"] = $context["title"];
                // line 18
                echo "            ";
                $context["selected_value"] = $context["name"];
                // line 19
                echo "            ";
                $context["selected_editable"] = false;
                // line 20
                echo "        ";
            }
            // line 21
            echo "    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['name'], $context['title'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 22
        echo "
    ";
        // line 23
        if (((($context["selected_editable"] ?? null) && $this->getAttribute(($context["gantry"] ?? null), "authorize", [0 => "outline.rename"], "method")) && (($context["configuration"] ?? null) != "default"))) {
            // line 24
            echo "    <span data-title-editable=\"";
            echo twig_escape_filter($this->env, ($context["selected_title"] ?? null), "html", null, true);
            echo "\"
          data-g-config-href=\"";
            // line 25
            echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => "configurations", 1 => ($context["selected_value"] ?? null), 2 => "rename"], "method"), "html", null, true);
            echo "\"
          class=\"title g-conf-title-edit\"
    >
        ";
            // line 28
            echo twig_escape_filter($this->env, ($context["selected_title"] ?? null), "html", null, true);
            echo "
    </span>
    <i class=\"fa fa-pencil fa-pencil-alt font-small\"
       aria-hidden=\"true\"
       tabindex=\"0\"
       aria-label=\"";
            // line 33
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_EDIT_TITLE", ($context["selected_title"] ?? null)), "html", null, true);
            echo "\"
       data-title-editable=\"";
            // line 34
            echo twig_escape_filter($this->env, ($context["selected_title"] ?? null), "html", null, true);
            echo "\"
       data-title-edit=\"\"></i>
    ";
        }
        // line 37
        echo "</li>
";
    }

    public function getTemplateName()
    {
        return "partials/configuration-selector.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  134 => 37,  128 => 34,  124 => 33,  116 => 28,  110 => 25,  105 => 24,  103 => 23,  100 => 22,  94 => 21,  91 => 20,  88 => 19,  85 => 18,  82 => 17,  79 => 16,  74 => 15,  68 => 14,  65 => 13,  62 => 12,  59 => 11,  56 => 10,  52 => 9,  48 => 7,  46 => 6,  41 => 5,  38 => 4,  35 => 3,  33 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "partials/configuration-selector.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\partials\\configuration-selector.html.twig");
    }
}
