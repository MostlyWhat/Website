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

/* partials/release-toggle.html.twig */
class __TwigTemplate_933aee20a100695ff08db8d60fea124f87d9df13e66c9a4e715823694f4f02da extends \Twig\Template
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
        if ($this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->authorize([0 => "admin.super"])) {
            // line 2
            echo "<form id=\"gpm-release-toggle\">
    <div class=\"switch-toggle switch-grav\" data-url=\"";
            // line 3
            echo twig_escape_filter($this->env, ($context["base_url"] ?? null), "html", null, true);
            echo "/ajax.json/task:gpmRelease\">
        <input type=\"radio\" value=\"stable\" id=\"stable\" name=\"channel-switch\" class=\"highlight\" ";
            // line 4
            if (($this->getAttribute($this->getAttribute($this->getAttribute(($context["config"] ?? null), "system", []), "gpm", []), "releases", []) == "stable")) {
                echo " checked=\"checked\"";
            }
            echo ">
        <label for=\"stable\">";
            // line 5
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.STABLE"), "html", null, true);
            echo "</label>
        <input type=\"radio\" value=\"testing\" id=\"testing\" name=\"channel-switch\" class=\"highlight\" ";
            // line 6
            if (($this->getAttribute($this->getAttribute($this->getAttribute(($context["config"] ?? null), "system", []), "gpm", []), "releases", []) == "testing")) {
                echo " checked=\"checked\"";
            }
            echo ">
        <label for=\"testing\">";
            // line 7
            echo twig_escape_filter($this->env, $this->env->getExtension('Grav\Common\Twig\Extension\GravExtension')->translate($this->env, "PLUGIN_ADMIN.TESTING"), "html", null, true);
            echo "</label>
        <a></a>
    </div>
</form>
";
        }
    }

    public function getTemplateName()
    {
        return "partials/release-toggle.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  55 => 7,  49 => 6,  45 => 5,  39 => 4,  35 => 3,  32 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% if authorize(['admin.super']) %}
<form id=\"gpm-release-toggle\">
    <div class=\"switch-toggle switch-grav\" data-url=\"{{ base_url }}/ajax.json/task:gpmRelease\">
        <input type=\"radio\" value=\"stable\" id=\"stable\" name=\"channel-switch\" class=\"highlight\" {% if config.system.gpm.releases == 'stable' %} checked=\"checked\"{% endif %}>
        <label for=\"stable\">{{ \"PLUGIN_ADMIN.STABLE\"|t }}</label>
        <input type=\"radio\" value=\"testing\" id=\"testing\" name=\"channel-switch\" class=\"highlight\" {% if config.system.gpm.releases == 'testing' %} checked=\"checked\"{% endif %}>
        <label for=\"testing\">{{ \"PLUGIN_ADMIN.TESTING\"|t }}</label>
        <a></a>
    </div>
</form>
{% endif %}
", "partials/release-toggle.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\admin\\themes\\grav\\templates\\partials\\release-toggle.html.twig");
    }
}
