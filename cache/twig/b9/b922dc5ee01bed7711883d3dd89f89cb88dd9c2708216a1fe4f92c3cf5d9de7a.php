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

/* @particles/logo.html.twig */
class __TwigTemplate_1f4a84604e6be1cb14bf3213eaf34e94dd9b74b65bb9297fc18b2ef75242eafe extends \Twig\Template
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
        $this->parent = $this->loadTemplate("@nucleus/partials/particle.html.twig", "@particles/logo.html.twig", 1);
        $this->parent->display($context, array_merge($this->blocks, $blocks));
    }

    // line 3
    public function block_particle($context, array $blocks = [])
    {
        // line 4
        echo "    ";
        $context["url"] = _twig_default_filter($this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute(($context["particle"] ?? null), "url", [])), $this->getAttribute(($context["gantry"] ?? null), "siteUrl", [], "method"));
        // line 5
        echo "    ";
        if ((($context["url"] ?? null) == $this->getAttribute(($context["gantry"] ?? null), "siteUrl", [], "method"))) {
            $context["rel"] = "rel=\"home\"";
        }
        // line 6
        echo "    ";
        $context["class"] = (($this->getAttribute(($context["particle"] ?? null), "class", [])) ? ((("class=\"" . $this->getAttribute(($context["particle"] ?? null), "class", [])) . "\"")) : (""));
        // line 7
        echo "    ";
        $context["image"] = $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute(($context["particle"] ?? null), "image", []));
        // line 8
        echo "    ";
        $context["height"] = (($this->getAttribute(($context["particle"] ?? null), "height", [])) ? ((("style=\"max-height: " . $this->getAttribute(($context["particle"] ?? null), "height", [])) . "\"")) : (""));
        // line 9
        echo "
    ";
        // line 10
        if (($this->getAttribute(($context["particle"] ?? null), "link", []) == true)) {
            // line 11
            echo "        <a href=\"";
            echo twig_escape_filter($this->env, ($context["url"] ?? null), "html", null, true);
            echo "\" target=\"";
            echo twig_escape_filter($this->env, (($this->getAttribute(($context["particle"] ?? null), "target", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["particle"] ?? null), "target", []), "_self")) : ("_self")), "html", null, true);
            echo "\" title=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["particle"] ?? null), "text", []), "html", null, true);
            echo "\" aria-label=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["particle"] ?? null), "text", []), "html", null, true);
            echo "\" ";
            echo ((array_key_exists("rel", $context)) ? (_twig_default_filter(($context["rel"] ?? null), "")) : (""));
            echo " ";
            echo ((array_key_exists("class", $context)) ? (_twig_default_filter(($context["class"] ?? null), "")) : (""));
            echo ">
    ";
        } else {
            // line 12
            echo "<div ";
            echo ((array_key_exists("class", $context)) ? (_twig_default_filter(($context["class"] ?? null), "")) : (""));
            echo ">";
        }
        // line 13
        echo "        ";
        if ( !twig_test_empty($this->getAttribute(($context["particle"] ?? null), "svg", []))) {
            // line 14
            echo "            ";
            echo $this->getAttribute(($context["particle"] ?? null), "svg", []);
            echo "
        ";
        } elseif (        // line 15
($context["image"] ?? null)) {
            // line 16
            echo "            <img src=\"";
            echo twig_escape_filter($this->env, $this->env->getExtension('Gantry\Component\Twig\TwigExtension')->urlFunc($this->getAttribute(($context["particle"] ?? null), "image", [])), "html", null, true);
            echo "\" ";
            echo ((array_key_exists("height", $context)) ? (_twig_default_filter(($context["height"] ?? null), "")) : (""));
            echo " alt=\"";
            echo twig_escape_filter($this->env, $this->getAttribute(($context["particle"] ?? null), "text", []), "html", null, true);
            echo "\" />
        ";
        } else {
            // line 18
            echo "            ";
            echo twig_escape_filter($this->env, (($this->getAttribute(($context["particle"] ?? null), "text", [], "any", true, true)) ? (_twig_default_filter($this->getAttribute(($context["particle"] ?? null), "text", []), "Logo")) : ("Logo")), "html", null, true);
            echo "
        ";
        }
        // line 20
        echo "    ";
        if (($this->getAttribute(($context["particle"] ?? null), "link", []) == true)) {
            echo "</a>";
        } else {
            echo "</div>";
        }
    }

    public function getTemplateName()
    {
        return "@particles/logo.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  111 => 20,  105 => 18,  95 => 16,  93 => 15,  88 => 14,  85 => 13,  80 => 12,  64 => 11,  62 => 10,  59 => 9,  56 => 8,  53 => 7,  50 => 6,  45 => 5,  42 => 4,  39 => 3,  29 => 1,);
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

{% block particle %}
    {% set url = url(particle.url)|default(gantry.siteUrl()) %}
    {% if (url == gantry.siteUrl()) %}{% set rel='rel=\"home\"' %}{% endif %}
    {% set class=(particle.class ? 'class=\"'~ particle.class ~'\"') %}
    {% set image = url(particle.image) %}
    {% set height = particle.height ? 'style=\"max-height: ' ~ particle.height ~ '\"' %}

    {% if particle.link == true %}
        <a href=\"{{ url }}\" target=\"{{ particle.target|default('_self') }}\" title=\"{{ particle.text }}\" aria-label=\"{{ particle.text }}\" {{ rel|default('')|raw }} {{ class|default('')|raw }}>
    {% else %}<div {{ class|default('')|raw }}>{% endif %}
        {% if particle.svg is not empty %}
            {{ particle.svg|raw }}
        {% elseif image %}
            <img src=\"{{ url(particle.image) }}\" {{ height|default('')|raw }} alt=\"{{ particle.text }}\" />
        {% else %}
            {{ particle.text|default('Logo') }}
        {% endif %}
    {% if particle.link == true %}</a>{% else %}</div>{% endif %}
{% endblock %}
", "@particles/logo.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\particles\\logo.html.twig");
    }
}
