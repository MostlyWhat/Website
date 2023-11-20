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

/* modular/features.html.twig */
class __TwigTemplate_9098ddfb7b288f298931971b4c42af3f355fa79399bd57785cef545c96b636a4 extends \Twig\Template
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
        echo "<div class=\"modular-row features ";
        echo twig_escape_filter($this->env, $this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "class", []), "html", null, true);
        echo "\">
    ";
        // line 2
        echo ($context["content"] ?? null);
        echo "
    <div class=\"feature-items\">
    ";
        // line 4
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable($this->getAttribute($this->getAttribute(($context["page"] ?? null), "header", []), "features", []));
        foreach ($context['_seq'] as $context["_key"] => $context["feature"]) {
            // line 5
            echo "           <div class=\"feature\">
            ";
            // line 6
            if ($this->getAttribute($context["feature"], "icon", [])) {
                // line 7
                echo "            <i class=\"fa fa-fw fa-";
                echo twig_escape_filter($this->env, $this->getAttribute($context["feature"], "icon", []), "html", null, true);
                echo "\" aria-hidden=\"true\"></i>
            <div class=\"feature-content icon-offset\">
            ";
            } else {
                // line 10
                echo "            <div class=\"feature-content\">
            ";
            }
            // line 12
            echo "            ";
            if ($this->getAttribute($context["feature"], "header", [])) {
                // line 13
                echo "            <h4>";
                echo twig_escape_filter($this->env, $this->getAttribute($context["feature"], "header", []), "html", null, true);
                echo "</h4>
            ";
            }
            // line 15
            echo "            ";
            if ($this->getAttribute($context["feature"], "text", [])) {
                // line 16
                echo "            <p>";
                echo twig_escape_filter($this->env, $this->getAttribute($context["feature"], "text", []), "html", null, true);
                echo "</p>
            ";
            }
            // line 18
            echo "            </div>
        </div>
    ";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['feature'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 21
        echo "    </div>
</div>
";
    }

    public function getTemplateName()
    {
        return "modular/features.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  86 => 21,  78 => 18,  72 => 16,  69 => 15,  63 => 13,  60 => 12,  56 => 10,  49 => 7,  47 => 6,  44 => 5,  40 => 4,  35 => 2,  30 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Source("<div class=\"modular-row features {{ page.header.class}}\">
    {{ content|raw }}
    <div class=\"feature-items\">
    {% for feature in page.header.features %}
           <div class=\"feature\">
            {% if feature.icon %}
            <i class=\"fa fa-fw fa-{{ feature.icon }}\" aria-hidden=\"true\"></i>
            <div class=\"feature-content icon-offset\">
            {% else %}
            <div class=\"feature-content\">
            {% endif %}
            {% if feature.header %}
            <h4>{{ feature.header }}</h4>
            {% endif %}
            {% if feature.text %}
            <p>{{ feature.text }}</p>
            {% endif %}
            </div>
        </div>
    {% endfor %}
    </div>
</div>
", "modular/features.html.twig", "D:\\MAMP\\htdocs\\grav\\user\\plugins\\gantry5\\engines\\nucleus\\templates\\modular\\features.html.twig");
    }
}
