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

/* @gantry-admin/pages/configurations/page/atoms.html.twig */
class __TwigTemplate_3bd5756d99c8ecdf4f709855a65e09bf5993afcff80491997ac3dffa1aa0a238 extends \Twig\Template
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
        echo "<h2 class=\"page-title\">
    <span class=\"title\">";
        // line 2
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_ATOMS"), "html", null, true);
        echo "</span>
</h2>

<div id=\"atoms\"";
        // line 5
        echo ((($context["overrideable"] ?? null)) ? (" class=\"atoms-override\"") : (""));
        echo ">
    <ul class=\"atoms-picker\">";
        // line 7
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["atoms"] ?? null));
        foreach ($context['_seq'] as $context["atom"] => $context["label"]) {
            // line 8
            echo "<li data-atom-type=\"";
            echo twig_escape_filter($this->env, $context["atom"], "html", null, true);
            echo "\"
            data-atom-picked=\"";
            // line 9
            echo twig_escape_filter($this->env, twig_jsonencode_filter(["title" => $context["label"], "type" => $context["atom"], "attributes" => $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "config", []), "get", [0 => ("particles." . $context["atom"])], "method")]), "html_attr");
            echo "\"
        >
            <i class=\"far fa-fw fa-hand-paper drag-indicator\" aria-hidden=\"true\"></i>
            <span class=\"atom-title\">";
            // line 12
            echo twig_escape_filter($this->env, $context["label"], "html", null, true);
            echo "</span>
            <a href=\"";
            // line 13
            echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => "configurations", 1 => ($context["page_id"] ?? null), 2 => "page", 3 => "atoms", 4 => $context["atom"]], "method"));
            echo "\" class=\"atom-settings config-cog\">
                <i aria-label=\"";
            // line 14
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_ATOMS_CONFIGURE_SETTINGS"), "html", null, true);
            echo "\" class=\"fa fa-cog\" aria-hidden=\"true\"></i>
            </a>
        </li>";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['atom'], $context['label'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 18
        echo "</ul>

    <div class=\"card settings-block\">
        ";
        // line 21
        $context["list"] = ((($this->getAttribute(($context["data"] ?? null), "get", [0 => "page.head.atoms"], "method", true, true) &&  !(null === $this->getAttribute(($context["data"] ?? null), "get", [0 => "page.head.atoms"], "method")))) ? ($this->getAttribute(($context["data"] ?? null), "get", [0 => "page.head.atoms"], "method")) : ($this->getAttribute(($context["defaults"] ?? null), "get", [0 => "page.head.atoms"], "method")));
        // line 22
        echo "        ";
        if (($context["list"] ?? null)) {
            // line 23
            echo "                <ul class=\"atoms-list\">";
            // line 24
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["list"] ?? null));
            foreach ($context['_seq'] as $context["_key"] => $context["atom"]) {
                // line 25
                $context["classes"] = ((($this->getAttribute($this->getAttribute($context["atom"], "attributes", []), "enabled", [])) ? ("") : ("atom-disabled")) . (($this->getAttribute($this->getAttribute($context["atom"], "inherit", []), "outline", [])) ? (" g-inheriting") : ("")));
                // line 26
                echo "                    ";
                $context["inheriting"] = (($this->getAttribute($this->getAttribute($context["atom"], "inherit", []), "outline", [])) ? (((((((" g-inheriting=\"\" data-tip=\"" . $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_INHERITING_FROM_X", (("<strong>" . $this->getAttribute($this->getAttribute(                // line 27
($context["gantry"] ?? null), "outlines", []), "title", [0 => $this->getAttribute($this->getAttribute($context["atom"], "inherit", []), "outline", [])], "method")) . "</strong>"))) . "<br />ID: ") . $this->getAttribute($this->getAttribute($context["atom"], "inherit", []), "atom", [])) . "<br />Replace: ") . twig_join_filter($this->getAttribute($this->getAttribute($context["atom"], "inherit", []), "include", []), ", ")) . "\"")) : (""));
                // line 28
                echo "                    ";
                $context["title"] = (($this->getAttribute($this->getAttribute($context["atom"], "attributes", []), "enabled", [])) ? ("") : (((" title=\"" . $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_ATOMS_DISABLED_DESC")) . "\"")));
                // line 29
                echo "                    <li data-atom-picked=\"";
                echo twig_escape_filter($this->env, twig_jsonencode_filter($context["atom"]), "html_attr");
                echo "\"";
                echo ((($context["classes"] ?? null)) ? (((" class=\"" . twig_trim_filter(($context["classes"] ?? null))) . "\"")) : (""));
                echo ($context["inheriting"] ?? null);
                echo ($context["title"] ?? null);
                echo " data-atom-type=\"";
                echo twig_escape_filter($this->env, $this->getAttribute($context["atom"], "type", []), "html", null, true);
                echo "\">
                        <i class=\"far fa-fw fa-hand-paper drag-indicator\" aria-hidden=\"true\"></i>
                        <span class=\"atom-title\">";
                // line 31
                echo twig_escape_filter($this->env, $this->getAttribute($context["atom"], "title", []), "html", null, true);
                echo "</span>
                        <a href=\"";
                // line 32
                echo twig_escape_filter($this->env, $this->getAttribute(($context["gantry"] ?? null), "route", [0 => "configurations", 1 => ($context["page_id"] ?? null), 2 => "page", 3 => "atoms", 4 => $this->getAttribute($context["atom"], "type", [])], "method"), "html", null, true);
                echo "\" class=\"atom-settings config-cog\">
                            <i aria-label=\"Configure Atom Settings\" class=\"fa fa-cog\" aria-hidden=\"true\"></i>
                        </a>
                    </li>";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['atom'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 37
            echo "</ul>
        ";
        } else {
            // line 39
            echo "            <ul class=\"atoms-list\"></ul>
        ";
        }
        // line 41
        echo "
        ";
        // line 42
        if (($context["overrideable"] ?? null)) {
            // line 43
            echo "            ";
            $context["prefix"] = "page.head.";
            // line 44
            echo "            ";
            $this->loadTemplate("forms/override.html.twig", "@gantry-admin/pages/configurations/page/atoms.html.twig", 44)->display(twig_array_merge($context, ["scope" => ($context["prefix"] ?? null), "name" => "atoms", "has_value" =>  !(null === $this->getAttribute(($context["data"] ?? null), "get", [0 => (($context["prefix"] ?? null) . "atoms")], "method")), "field" => ["label" => "Enabled of the field Atoms"]]));
            // line 45
            echo "        ";
        }
        // line 46
        echo "    </div>

    ";
        // line 49
        echo "    ";
        if ((( !(null === ($context["atoms_deprecated"] ?? null)) && twig_length_filter($this->env, ($context["atoms_deprecated"] ?? null))) && $this->getAttribute(($context["data"] ?? null), "get", [0 => "page.head.atoms"], "method"))) {
            // line 50
            echo "        <p class=\"alert alert-notice\">";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_ATOMS_DEPRECATED_MESSAGE"), "html", null, true);
            echo "</p>
    ";
        }
        // line 52
        echo "
    <div id=\"trash\" data-atoms-erase=\"\"><div class=\"trash-zone\">&times;</div><span>";
        // line 53
        echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_DROP_DELETE"), "html", null, true);
        echo "</span></div>
    ";
        // line 55
        echo "</div>";
    }

    public function getTemplateName()
    {
        return "@gantry-admin/pages/configurations/page/atoms.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  168 => 55,  164 => 53,  161 => 52,  155 => 50,  152 => 49,  148 => 46,  145 => 45,  142 => 44,  139 => 43,  137 => 42,  134 => 41,  130 => 39,  126 => 37,  116 => 32,  112 => 31,  100 => 29,  97 => 28,  95 => 27,  93 => 26,  91 => 25,  87 => 24,  85 => 23,  82 => 22,  80 => 21,  75 => 18,  66 => 14,  62 => 13,  58 => 12,  52 => 9,  47 => 8,  43 => 7,  39 => 5,  33 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/pages/configurations/page/atoms.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\pages\\configurations\\page\\atoms.html.twig");
    }
}
