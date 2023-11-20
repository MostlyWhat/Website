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

/* @particles/totop.html.twig */
class __TwigTemplate_a27e8ffe85fa793c87cff30b8254417e5871a4dc8544f4c7b4c125f4503a1e92 extends \Twig\Template
{
    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->blocks = [
            'particle' => [$this, 'block_particle'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 1
        return "@nucleus/partials/particle.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        // line 3
        $context["linkTitle"] = (($this->getAttribute(($context["particle"] ?? null), "title", [])) ? (twig_escape_filter($this->env, $this->getAttribute(($context["particle"] ?? null), "title", []))) : (twig_escape_filter($this->env, $this->getAttribute(($context["particle"] ?? null), "text", []))));
        // line 1
        $this->parent = $this->loadTemplate("@nucleus/partials/particle.html.twig", "@particles/totop.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 5
    public function block_particle($context, array $blocks = [])
    {
        // line 6
        echo "<div class=\"";
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["particle"] ?? null), "css", []), "class", []));
        echo "\">
    <div class=\"g-totop\">
        <a href=\"#\" id=\"g-totop\" rel=\"nofollow\"";
        // line 8
        if (($context["linkTitle"] ?? null)) {
            echo " title=\"";
            echo twig_escape_filter($this->env, ($context["linkTitle"] ?? null), "html", null, true);
            echo "\" aria-label=\"";
            echo twig_escape_filter($this->env, ($context["linkTitle"] ?? null), "html", null, true);
            echo "\"";
        }
        echo ">
            ";
        // line 9
        if ($this->getAttribute(($context["particle"] ?? null), "content", [])) {
            echo $this->getAttribute(($context["particle"] ?? null), "content", []);
        }
        // line 10
        echo "            ";
        if ($this->getAttribute(($context["particle"] ?? null), "icon", [])) {
            echo "<i class=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["particle"] ?? null), "icon", []), "html", null, true);
            echo "\"></i>";
        }
        // line 11
        echo "            ";
        if (( !$this->getAttribute(($context["particle"] ?? null), "icon", []) &&  !$this->getAttribute(($context["particle"] ?? null), "content", []))) {
            echo "To Top";
        }
        // line 12
        echo "        </a>
    </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "@particles/totop.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  77 => 12,  72 => 11,  65 => 10,  61 => 9,  51 => 8,  45 => 6,  42 => 5,  37 => 1,  35 => 3,  29 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("{% extends '@nucleus/partials/particle.html.twig' %}

{% set linkTitle = particle.title ? particle.title|e : particle.text|e %}

{% block particle %}
<div class=\"{{ particle.css.class|e }}\">
    <div class=\"g-totop\">
        <a href=\"#\" id=\"g-totop\" rel=\"nofollow\"{% if linkTitle %} title=\"{{linkTitle}}\" aria-label=\"{{linkTitle}}\"{% endif %}>
            {% if particle.content %}{{particle.content|raw}}{% endif %}
            {% if particle.icon %}<i class=\"{{particle.icon}}\"></i>{% endif %}
            {% if not particle.icon and not particle.content %}To Top{% endif %}
        </a>
    </div>
</div>
{% endblock %}
", "@particles/totop.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\themes\\trajectory\\particles\\totop.html.twig");
    }
}
