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

/* @gantry-admin/partials/updates.html.twig */
class __TwigTemplate_8361cb042b79cc42885a8c58a89fe75a3853067e2862a101eaf45d9941b85eee extends \Twig\Template
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
        $context["updates"] = $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "platform", []), "updates", []);
        // line 2
        if (($context["updates"] ?? null)) {
            // line 3
            $context["version"] = twig_last($this->env, twig_split_filter($this->env, $this->getAttribute(($context["updates"] ?? null), 0, []), " "));
            // line 4
            echo "<div class=\"g-grid\">
    <div class=\"g-block\">
        <div class=\"update-header clearfix\">
            <span class=\"update-text\">";
            // line 7
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_UPDATES_AVAILABLE"), "html", null, true);
            echo ": ";
            echo twig_escape_filter($this->env, twig_join_filter(($context["updates"] ?? null), ", "), "html", null, true);
            echo "</span>
            <div class=\"update-tools\">
                <a href=\"";
            // line 9
            echo $this->getAttribute($this->getAttribute(($context["gantry"] ?? null), "platform", []), "update", []);
            echo "\" class=\"button button-update\">
                    <i class=\"fa fa-refresh\" aria-hidden=\"true\"></i> <span>";
            // line 10
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_UPDATE"), "html", null, true);
            echo "</span>
                </a>
                <a href=\"#\" data-changelog=\"";
            // line 12
            echo twig_escape_filter($this->env, ($context["version"] ?? null), "html", null, true);
            echo "\" class=\"button button-update\">
                    <i class=\"fa fa-book\" aria-hidden=\"true\"></i> <span>";
            // line 13
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->transFilter("GANTRY5_PLATFORM_CHANGELOG"), "html", null, true);
            echo "</span>
                </a>
                <a href=\"#\" class=\"fa fa-close\" aria-hidden=\"true\" data-g-close=\".g-grid\"></a>
            </div>
        </div>
    </div>
</div>
";
        }
    }

    public function getTemplateName()
    {
        return "@gantry-admin/partials/updates.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  61 => 13,  57 => 12,  52 => 10,  48 => 9,  41 => 7,  36 => 4,  34 => 3,  32 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("", "@gantry-admin/partials/updates.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\admin\\templates\\partials\\updates.html.twig");
    }
}
